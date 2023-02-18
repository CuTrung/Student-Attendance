import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';
import MyPagination from '../../both/pagination';
import '../../../assets/scss/admin/registrationGroups/listRegistrationGroups.scss';
import LoadingIcon from '../../both/loadingIcon';

const ListRegistrationGroups = (props) => {

    const handleEdit = async (registrationGroup) => {
        await props.setRegistrationGroupUpdate(registrationGroup);
        props.setIsUpdate(true);
    }

    const handleOpenDelete = async (registrationGroupId, type) => {
        try {
            let isClosed;
            if (type) {
                isClosed = type === 'OPEN' ? '0' : '1';
            }

            let data = await axios.delete('api/registrationGroups', {
                data: { id: registrationGroupId, isClosed },
            });
            if (data && data.EC === 0) {
                toast.success(data.EM);
                props.fetchRegistrationGroups();
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
                    <Table className='listRegistrationGroups' bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {props.listRegistrationGroups && props.listRegistrationGroups.length > 0
                                && props.listRegistrationGroups.map((registrationGroup, index) => {
                                    return (
                                        <tr key={`registrationGroup-${index + 1}`}>
                                            <td>{registrationGroup.name}</td>
                                            <td>{registrationGroup.description}</td>
                                            <td className='d-flex gap-1'>
                                                <Button
                                                    variant="warning" type="button"
                                                    onClick={() => handleEdit(registrationGroup)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    name={registrationGroup.isClosed === 0 ? 'ClOSE' : 'OPEN'}
                                                    className={`btn ${registrationGroup.isClosed === 0 ? 'btn-secondary' : 'btn-success'}`}
                                                    onClick={(event) => handleOpenDelete(registrationGroup.id, event.target.name)}>
                                                    {registrationGroup.isClosed === 0 ? 'Close' : 'Open'}
                                                </Button>

                                                <Button className='btn btn-danger'
                                                    onClick={() => handleOpenDelete(registrationGroup.id)}>
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

export default ListRegistrationGroups;