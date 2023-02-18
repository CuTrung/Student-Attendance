import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import axios from "../../../../configs/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import LoadingIcon from '../../../both/loadingIcon';

const ManageAttendanceDetails = (props) => {
    const navigate = useNavigate();
    const { pathname, state } = useLocation();
    const [listAttendanceDetails, setListAttendanceDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getListAttendanceDetailsByClassGroupId = async () => {
        try {
            let data = await axios.get('api/attendanceDetails', {
                params: {
                    id: state?.classGroupId,
                }
            });

            if (data && data.EC === 0) {
                setListAttendanceDetails(data.DT);
                setIsLoading(false);
                toast.success(data.EM);
            }
        } catch (error) {
            toast.error("Something wrongs on client...");
            console.log(error);
        }
    }

    useEffect(() => {
        getListAttendanceDetailsByClassGroupId();
    }, [])


    return (
        <>
            <h3 className="text-center">Manage Attendance Details Class Group</h3>
            {isLoading ?
                <LoadingIcon />
                :
                <>
                    <Table hover bordered className='mt-3 container' >
                        <thead>
                            <tr>
                                <th className='table-success'>Attend</th>
                                <th className='table-danger'>Absent</th>
                                <th className='table-warning'>Late</th>
                                <th className='table-primary'>Lie</th>
                                <th className='table-info'>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listAttendanceDetails.length > 0 &&
                                listAttendanceDetails.map((item, index) => {
                                    return (
                                        <tr key={`attendanceDetails-${index}`}>
                                            {Object.keys(item).map((keyItem) => {
                                                return (
                                                    <td key={`${keyItem}`}>
                                                        {
                                                            keyItem === 'date' ?
                                                                <strong>
                                                                    {item[keyItem]}
                                                                </strong>
                                                                :
                                                                item[keyItem].length > 0 && item[keyItem].map((student, indexStudent) => {
                                                                    return (
                                                                        <p key={`student-${indexStudent}`}>
                                                                            <strong>{indexStudent + 1}</strong>. {student.fullName}
                                                                        </p>
                                                                    )
                                                                })
                                                        }
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>

                    <div className="container">
                        <Button
                            onClick={() => navigate('/manage')}
                            className="float-end btn-danger">Cancel</Button>
                    </div>
                </>
            }
        </>
    )
}

export default ManageAttendanceDetails;