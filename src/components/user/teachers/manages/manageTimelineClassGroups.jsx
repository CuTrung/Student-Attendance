import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import axios from "../../../../configs/axios";
import ManageListSpecialStudents from './manageListSpecialStudents';
import '../../../../assets/scss/user/teachers/manages/manageTimelineClassGroups.scss';
import validationUtils from '../../../../utils/validationUtils';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import LoadingIcon from '../../../both/loadingIcon';

const ManageTimelineClassGroups = (props) => {
    const [classGroups, setClassGroups] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);


    const handleOnChange = (event) => {
        if (event.target.classList.contains('is-invalid')) {
            event.target.classList.remove('is-invalid')
        }
    }

    // Khi login success, sẽ gửi teacherId để lọc ra subjects teacher đang dạy 
    const getClassGroups = async (teacherId) => {
        try {
            teacherId = 1;
            let data = await axios.get(`api/manage-classGroups/${teacherId}`);

            if (data && data.EC === 0) {
                setClassGroups(data.DT);
                setIsLoading(false);
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error("Something wrongs on client ...");
            console.log(error);
        }
    }


    const handleOnClick = async (type, classGroupId, value, isActiveBefore) => {
        try {
            let timeline, isActive;
            if (type === 'TIMELINE') {
                if (value === 'AFTER') {
                    timeline = 'BEFORE';
                    // if don't want limitStudents
                    isActive = '1';
                } else if (value === 'BEFORE') {
                    if (!isActiveBefore) {
                        toast.error("You need to active classGroup before change timeline");
                        return;
                    }
                    timeline = 'LATE';
                } else {

                    timeline = 'AFTER';
                    // Prevent student continue attendance when
                    // limitStudents didn't have value
                    isActive = '0';
                }
            }


            if (type === 'ACTIVE') {
                isActive = value === 0 ? '1' : '0';
            }

            if (type !== 'LIMIT') {
                let data = await axios.post('api/manage-classGroups', {
                    id: classGroupId, timeline, isActive
                });

                if (data && data.EC === 0) {
                    toast.success(data.EM);
                    getClassGroups();
                }
            }


            if (type === 'LIMIT') {
                let isValid = validationUtils.validate("limit");
                if (isValid) {
                    let limitStudents = document.querySelector(`[name="inputLimit-${classGroupId}"]`).value;
                    isActive = '1';
                    // call API limit students can attendance
                    let data = await axios.get(`api/classGroups/${classGroupId}/${limitStudents}/${isActive}`);

                    if (data && data.EC === 0) {
                        toast.success(data.EM);
                        getClassGroups();
                    }
                }
            }

        } catch (error) {
            toast.error("Something wrongs on client...");
            console.log(error);
        }


    }

    const handleClickStopView = async (classGroupId) => {
        navigate('special', { state: { classGroupId } })
    }

    const handleClickViewDetails = async (classGroupId) => {
        navigate('details', { state: { classGroupId } })
    }

    useEffect(() => {
        getClassGroups();
    }, []);




    return (
        <>
            <h3 className="text-center">Manage Timeline Class Group</h3>
            {isLoading ?
                <LoadingIcon />
                :
                <Table hover bordered className='mt-3 container' >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Class Group</th>
                            <th>Show Code</th>
                            <th>Stop and view result</th>
                            <th>View Details</th>
                            <th>Timeline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classGroups.length > 0 &&
                            classGroups.map((classGroup, index) => {
                                return (
                                    <tr className='text-center' key={`classGroup-${index}`}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {`${classGroup.SchoolYear.name}.${classGroup.Subject.description}.${classGroup.RegistrationGroup.name}`}
                                        </td>
                                        <td className='text-center'>
                                            {classGroup.showCode}
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() => handleClickStopView(classGroup.id)}
                                                className='btn-danger'
                                            >Stop and view</Button>
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() => handleClickViewDetails(classGroup.id)}
                                                className='btn-info'
                                            >View Details</Button>

                                        </td>
                                        <td className="py-0 d-flex flex-column">
                                            <span className='d-flex gap-2 my-2'>
                                                <Button
                                                    onClick={() => handleOnClick('TIMELINE', classGroup.id, classGroup.timeline, classGroup.isActive)}
                                                    className={`btn-${classGroup.timeline === 'BEFORE' ? 'primary' : (classGroup.timeline === 'LATE' ? 'danger' : 'warning')}`}
                                                >
                                                    {classGroup.timeline}
                                                </Button>

                                                {classGroup.timeline === 'AFTER' &&
                                                    <form id='limit' className='d-flex w-25'>
                                                        <input
                                                            onChange={(event) => handleOnChange(event)}
                                                            name={`inputLimit-${classGroup.id}`}
                                                            type="number" className='form-control w-75 me-2 py-1' />
                                                        <button
                                                            type='button'
                                                            onClick={() => handleOnClick('LIMIT', classGroup.id)}
                                                            className='btn btn-danger rounded-circle px-0 px-1'>Limit</button>
                                                    </form>
                                                }


                                                <Button
                                                    onClick={() => handleOnClick('ACTIVE', classGroup.id, classGroup.isActive)}
                                                    className={`btnActive-${classGroup.id} btn-${classGroup.isActive === 1 ? 'success' : 'secondary'}`}
                                                >
                                                    {classGroup.isActive === 1 ? 'Active' : 'Inactive'}
                                                </Button>
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            }
        </>

    )
}

export default ManageTimelineClassGroups;