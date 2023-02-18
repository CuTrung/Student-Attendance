import Table from 'react-bootstrap/Table';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';
import axios from '../../../configs/axios';
import MyPagination from '../../both/pagination';
import '../../../assets/scss/admin/students/listStudents.scss';
import { toast } from 'react-toastify';
import LoadingIcon from '../../both/loadingIcon';

const ListStudents = (props) => {
    const handleActiveDelete = async (email, type) => {
        try {
            let isDeleted;
            if (type) {
                isDeleted = type === 'ACTIVE' ? '0' : '1';
            }

            let data = await axios.delete('api/students', {
                data: { email, isDeleted },
            });
            if (data && data.EC === 0) {
                toast.success(data.EM);
                props.fetchStudents();
            }
        } catch (error) {
            toast.error(data.EM);
            console.log(error);
        }
    }

    const handleEdit = (studentUpdate) => {
        props.getStudentUpdate(studentUpdate);
        props.setIsUpdate(true);
        if (document.querySelector('.accordion-button').classList.contains('collapsed')) {
            document.querySelector('.accordion-button').click();
        };

        // Back to top
        scroll(0, 0);
    }



    return (
        <>
            {props.isLoading ?
                <LoadingIcon />
                :
                <>
                    <Table className='listStudents my-4 ' bordered hover>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Full name</th>
                                <th>Email</th>
                                <th>School year</th>
                                <th>Major</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.listStudents && props.listStudents.length > 0
                                && props.listStudents.map((student, index) => {
                                    return (
                                        <tr key={`student-${index + 1}`}>
                                            <td>{index + 1}</td>
                                            <td>{student.fullName}</td>
                                            <td>{student.email}</td>
                                            <td className='schoolYear'>{student.SchoolYear.description}</td>
                                            <td>{student.Major.description}</td>
                                            <td className='d-flex gap-1'>
                                                <Button className='btn btn-warning'
                                                    onClick={() => handleEdit(student)}
                                                >Edit</Button>

                                                <Button
                                                    name={student.isDeleted === 0 ? 'INACTIVE' : 'ACTIVE'}
                                                    className={`btn ${student.isDeleted === 0 ? 'btn-secondary' : 'btn-success'}`}
                                                    onClick={(event) => handleActiveDelete(student.email, event.target.name)}>
                                                    {student.isDeleted === 0 ? 'Inactive' : 'Active'}
                                                </Button>

                                                <Button className='btn btn-danger'
                                                    onClick={() => handleActiveDelete(student.email)}>
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

export default ListStudents;