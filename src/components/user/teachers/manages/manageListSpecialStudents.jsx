import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import axios from "../../../../configs/axios";
import Form from 'react-bootstrap/Form';
import { RiAlarmWarningFill } from 'react-icons/ri';
import '../../../../assets/scss/user/teachers/manages/manageListSpecialStudents.scss';
import { useLocation, useNavigate } from "react-router-dom";
import LoadingIcon from "../../../both/loadingIcon";




const ManageListSpecialStudents = (props) => {
    const [listSpecialStudents, setListSpecialStudents] = useState([]);
    const { pathname, state } = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirm, setIsConfirm] = useState(false);

    const getListSpecialStudentsByClassGroupId = async () => {
        try {
            // Nếu teacher click "Stop and view" trong trường hợp 
            // student attendance < limitStudents, cần alert cảnh báo,
            // teacher xác nhận thì active lại classGroup đó để student can 
            // continue attendance, còn ko thì stop attendance
            // await axios.post('api/manage-classGroups', {
            //     id: classGroupId, isActive: '0'
            // });


            let data = await axios.post('api/specialStudents', {
                id: state?.classGroupId,
                isActive: '0',
            });

            if (data && data.EC === 0) {
                setListSpecialStudents(data.DT);
                setIsLoading(false);
                toast.success(data.EM);
            }
        } catch (error) {
            toast.error("Something wrongs on client...");
            console.log(error);
        }


    }

    const handleConfirm = async () => {
        try {
            // setIsConfirm(true);
            let studentCheck = document.querySelectorAll("[type='radio']");
            let listStudentsAttendance = [];
            [...studentCheck].forEach((item) => {
                if (item.checked) {
                    let statusUpdate = item.value;
                    let statusBefore = item.getAttribute('data-status_before');
                    let studentId = item.getAttribute('data-id');
                    let isLie = false;
                    let isLate = false;

                    // Student LIE (xuất hiện khi teacher điểm danh bằng miệng) 
                    if (statusBefore === 'ATTEND' || statusBefore === 'LATE | ATTEND') {
                        if (statusUpdate === 'ABSENT') {
                            isLie = true;
                        }
                    }

                    if (statusBefore === 'LATE | ATTEND' && statusUpdate === 'ATTEND') {
                        isLate = true;
                    }

                    let student = {
                        status: statusUpdate,
                        isLie,
                        isLate,
                        id: studentId
                    }

                    listStudentsAttendance.push(student);
                }
            })

            let studentAttendIds = [];
            let absentStudentIds = [];
            let lateStudentIds = [];
            let lieStudentIds = [];
            listStudentsAttendance.forEach((student) => {
                if (student.status === 'ATTEND') {
                    if (student.isLate) {
                        lateStudentIds.push(+student.id);
                    }

                    studentAttendIds.push(+student.id);
                } else {
                    if (student.isLie) {
                        lieStudentIds.push(+student.id);
                    }

                    absentStudentIds.push(+student.id)
                }

            })

            let data = await axios.post('api/attendanceDetails', {
                studentIdsStatus: {
                    studentAttendIds: JSON.stringify(studentAttendIds),
                    absentStudentIds: JSON.stringify(absentStudentIds),
                    lateStudentIds: JSON.stringify(lateStudentIds),
                    lieStudentIds: JSON.stringify(lieStudentIds),
                },
                classGroupId: listSpecialStudents[0].classGroupId
            });

            if (data && data.EC === 0) {
                // May be delay time in there
                setIsConfirm(false);
                toast.success(data.EM);
            }

        } catch (error) {
            toast.error("Something wrongs on client...");
            console.log(error);
        }
    }

    const changeColorRow = (lie, late) => {
        if (lie > 0 && late === 0 || lie > 0 && late > 0) {
            return 'table-danger';
        } else if (lie === 0 && late > 0) {
            return 'table-warning';
        } else {
            return 'table-success';
        }
    }

    useEffect(() => {
        getListSpecialStudentsByClassGroupId();
    }, [])


    return (
        <>
            {isLoading ?
                <LoadingIcon />
                :
                <>
                    <h3 className="position-relative text-center my-3">
                        <ul className="note list-group position-absolute top-0 start-0">
                            <li className="list-group-item list-group-item-success">ATTEND</li>
                            <li className="list-group-item list-group-item-danger">LIE</li>
                            <li className="list-group-item list-group-item-warning">LATE</li>
                            <li className="list-group-item list-group-item-secondary">ALL</li>
                        </ul>
                        Manage List Special Students Class Group
                        <Button
                            onClick={() => navigate('/manage')}
                            className="position-absolute top-0 end-0 me-3"
                        >Manage Class Groups</Button>
                    </h3>

                    <Table hover bordered className='mt-3 container' >
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Full name</th>
                                <th>Email</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listSpecialStudents.length > 0 &&
                                listSpecialStudents.map((specialStudent, index) => {
                                    return (
                                        <tr className={`text-center ${changeColorRow(+specialStudent.numberOfLies, +specialStudent.numberOfTimesBeingLate)}`} key={`specialStudent-${index}`}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {specialStudent.fullName}
                                            </td>
                                            <td>
                                                {specialStudent.email}
                                            </td>
                                            <td>
                                                <>
                                                    <Form.Check
                                                        defaultChecked={specialStudent.status === 'LIE | ABSENT'}
                                                        inline
                                                        label="ABSENT"
                                                        value={"ABSENT"}
                                                        data-id={specialStudent.id}
                                                        data-status_before={specialStudent.status}
                                                        name={`studentCheck-${specialStudent.id}`}
                                                        type={'radio'}
                                                    />
                                                    <Form.Check
                                                        defaultChecked={specialStudent.status !== 'LIE | ABSENT'}
                                                        inline
                                                        label="ATTEND"
                                                        value={"ATTEND"}
                                                        data-id={specialStudent.id}
                                                        data-status_before={specialStudent.status}
                                                        name={`studentCheck-${specialStudent.id}`}
                                                        type={'radio'}
                                                    />
                                                </>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </Table>

                    <div className="container">
                        <Button
                            disabled={isConfirm}
                            onClick={() => handleConfirm()}
                            className="float-end btn-success">Confirm</Button>
                    </div>
                </>
            }
        </>
    )
}

export default ManageListSpecialStudents;