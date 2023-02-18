import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';
import MyPagination from '../../both/pagination';
import '../../../assets/scss/admin/departments/listDepartments.scss';
import LoadingIcon from '../../both/loadingIcon';

const ListDepartments = (props) => {

    const handleEdit = async (department) => {
        await props.setDepartmentUpdate(department);
        props.setIsUpdate(true);
    }

    const handleOpenDelete = async (departmentId, type) => {
        try {
            let isClosed;
            if (type) {
                isClosed = type === 'OPEN' ? '0' : '1';
            }

            let data = await axios.delete('api/departments', {
                data: { id: departmentId, isClosed },
            });
            if (data && data.EC === 0) {
                toast.success(data.EM);
                props.fetchDepartments();
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
                    <Table className='listDepartments' bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {props.listDepartments && props.listDepartments.length > 0
                                && props.listDepartments.map((department, index) => {
                                    return (
                                        <tr key={`department-${index + 1}`}>
                                            <td>{department.name}</td>
                                            <td>{department.description}</td>
                                            <td className='d-flex gap-1'>
                                                <Button
                                                    variant="warning" type="button"
                                                    onClick={() => handleEdit(department)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    name={department.isClosed === 0 ? 'ClOSE' : 'OPEN'}
                                                    className={`btn ${department.isClosed === 0 ? 'btn-secondary' : 'btn-success'}`}
                                                    onClick={(event) => handleOpenDelete(department.id, event.target.name)}>
                                                    {department.isClosed === 0 ? 'Close' : 'Open'}
                                                </Button>

                                                <Button className='btn btn-danger'
                                                    onClick={() => handleOpenDelete(department.id)}>
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

export default ListDepartments;