import Table from 'react-bootstrap/Table';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';
import axios from '../../../configs/axios';
import MyPagination from '../../both/pagination';
import '../../../assets/scss/admin/teachers/listTeachers.scss';
import { toast } from 'react-toastify';
import LoadingIcon from '../../both/loadingIcon';

const ListTeachers = (props) => {
    const handleActiveDelete = async (email, type) => {
        try {
            let isDeleted;
            if (type) {
                isDeleted = type === 'ACTIVE' ? '0' : '1';
            }

            let data = await axios.delete('api/teachers', {
                data: { email, isDeleted },
            });
            if (data && data.EC === 0) {
                toast.success(data.EM);
                props.fetchTeachers();
            }
        } catch (error) {
            toast.error(data.EM);
            console.log(error);
        }
    }

    const handleEdit = (teacherUpdate) => {
        props.getTeacherUpdate(teacherUpdate);
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
                    <Table className='listTeachers my-4 ' bordered hover>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Full name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.listTeachers && props.listTeachers.length > 0
                                && props.listTeachers.map((teacher, index) => {
                                    return (
                                        <tr key={`teacher-${index + 1}`}>
                                            <td>{index + 1}</td>
                                            <td>{teacher.fullName}</td>
                                            <td>{teacher.email}</td>
                                            <td className='d-flex gap-1'>
                                                <Button className='btn btn-warning'
                                                    onClick={() => handleEdit(teacher)}
                                                >Edit</Button>

                                                <Button
                                                    name={teacher.isDeleted === 0 ? 'INACTIVE' : 'ACTIVE'}
                                                    className={`btn ${teacher.isDeleted === 0 ? 'btn-secondary' : 'btn-success'}`}
                                                    onClick={(event) => handleActiveDelete(teacher.email, event.target.name)}>
                                                    {teacher.isDeleted === 0 ? 'Inactive' : 'Active'}
                                                </Button>

                                                <Button className='btn btn-danger'
                                                    onClick={() => handleActiveDelete(teacher.email)}>
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

export default ListTeachers;