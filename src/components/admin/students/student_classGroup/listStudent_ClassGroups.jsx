import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../../configs/axios';
import { toast } from 'react-toastify';
import MyPagination from '../../../both/pagination';
import '../../../../assets/scss/admin/student_classGroups/listStudent_ClassGroups.scss';
import LoadingIcon from '../../../both/loadingIcon';

const ListStudent_ClassGroups = (props) => {

    const handleEdit = async (student_classGroup) => {
        await props.setStudent_ClassGroupUpdate(student_classGroup);
        props.setIsUpdate(true);
    }

    const handleOpenDelete = async (student_classGroupId, type) => {
        try {
            let isClosed;
            if (type) {
                isClosed = type === 'OPEN' ? '0' : '1';
            }

            let data = await axios.delete('api/student_classGroups', {
                data: { studentId: student_classGroupId, isClosed },
            });
            if (data && data.EC === 0) {
                toast.success(data.EM);
                props.fetchStudent_ClassGroups();
            }
        } catch (error) {
            toast.error(data.EM);
            console.log(error);
        }
    }


    return (
        <>
            {props.isLoading ?
                <LoadingIcon />
                :
                <>
                    <Table className='listStudent_ClassGroups' bordered hover>
                        <thead>
                            <tr>
                                {/* Name = schoolYear + . + subject + . + registrationGroup */}
                                <th>Name</th>
                                <th>ClassGroup</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.listStudent_ClassGroups && props.listStudent_ClassGroups.length > 0
                                && props.listStudent_ClassGroups.map((student_classGroup, index) => {
                                    return (
                                        <tr key={`student_classGroup-${index + 1}`}>
                                            <td className='fullName'>{student_classGroup.fullName}</td>
                                            <td className='text-truncate'>
                                                {student_classGroup.classGroups && student_classGroup.classGroups.length > 0 &&
                                                    student_classGroup.classGroups.map((classGroup, index) => {
                                                        return (
                                                            <p key={`classGroup-${index + 1}`} className='mb-0 mb-2'>
                                                                {student_classGroup.classGroups.length > 1 ?
                                                                    <><strong>{index + 1}. </strong>{classGroup.name}</>
                                                                    :
                                                                    `${classGroup.name}`
                                                                }
                                                            </p>
                                                        )
                                                    })}
                                            </td>
                                            <td className='d-flex gap-1'>
                                                <Button
                                                    variant="warning" type="button"
                                                    onClick={() => handleEdit(student_classGroup)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button className='btn btn-danger'
                                                    onClick={() => handleOpenDelete(student_classGroup.id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>

                                    )
                                })}
                        </tbody>
                    </Table>

                    {
                        props.totalPages > 0 &&
                        <MyPagination
                            totalPages={props.totalPages}
                            setCurrentPage={props.setCurrentPage}
                        />
                    }
                </>
            }
        </>
    )
}

export default ListStudent_ClassGroups;