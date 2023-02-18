import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';
import MyPagination from '../../both/pagination';
import '../../../assets/scss/admin/majors/listMajors.scss';
import LoadingIcon from '../../both/loadingIcon';

const ListMajors = (props) => {

    const handleEdit = async (major) => {
        await props.setMajorUpdate(major);
        props.setIsUpdate(true);
    }

    const handleOpenDelete = async (majorId, type) => {
        try {
            let isClosed;
            if (type) {
                isClosed = type === 'OPEN' ? '0' : '1';
            }

            let data = await axios.delete('api/majors', {
                data: { id: majorId, isClosed },
            });
            if (data && data.EC === 0) {
                toast.success(data.EM);
                props.fetchMajors();
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
                    <Table className='listMajors' bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.listMajors && props.listMajors.length > 0
                                && props.listMajors.map((major, index) => {
                                    return (
                                        <tr key={`major-${index + 1}`}>
                                            <td>{major.name}</td>
                                            <td>{major.description}</td>
                                            <td>{major.Department.description}</td>
                                            <td className='d-flex gap-1'>
                                                <Button
                                                    variant="warning" type="button"
                                                    onClick={() => handleEdit(major)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    name={major.isClosed === 0 ? 'ClOSE' : 'OPEN'}
                                                    className={`btn ${major.isClosed === 0 ? 'btn-secondary' : 'btn-success'}`}
                                                    onClick={(event) => handleOpenDelete(major.id, event.target.name)}>
                                                    {major.isClosed === 0 ? 'Close' : 'Open'}
                                                </Button>

                                                <Button className='btn btn-danger'
                                                    onClick={() => handleOpenDelete(major.id)}>
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

export default ListMajors;