import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';
import MyPagination from '../../both/pagination';
import '../../../assets/scss/admin/classGroups/listClassGroups.scss';
import LoadingIcon from '../../both/loadingIcon';

const ListClassGroups = (props) => {

    const handleEdit = async (classGroup) => {
        await props.setClassGroupUpdate(classGroup);
        props.setIsUpdate(true);
    }

    const handleOpenDelete = async (classGroupId, type) => {
        try {
            let isClosed;
            if (type) {
                isClosed = type === 'OPEN' ? '0' : '1';
            }

            let data = await axios.delete('api/classGroups', {
                data: { id: classGroupId, isClosed },
            });
            if (data && data.EC === 0) {
                toast.success(data.EM);
                props.fetchClassGroups();
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
                    <Table className='listClassGroups' bordered hover>
                        <thead>
                            <tr>
                                {/* Name = schoolYear + . + subject + . + registrationGroup */}
                                <th>Name</th>
                                <th>Teacher</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.listClassGroups && props.listClassGroups.length > 0
                                && props.listClassGroups.map((classGroup, index) => {
                                    return (
                                        <tr key={`classGroup-${index + 1}`}>
                                            <td className='text-truncate'>
                                                {`${classGroup.SchoolYear.name}.${classGroup.Subject.description}.${classGroup.RegistrationGroup.name}`}
                                            </td>
                                            <td className='fullName'>{classGroup.Teacher.fullName}</td>
                                            <td className='d-flex gap-1'>
                                                <Button
                                                    variant="warning" type="button"
                                                    onClick={() => handleEdit(classGroup)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    name={classGroup.isClosed === 0 ? 'ClOSE' : 'OPEN'}
                                                    className={`btn ${classGroup.isClosed === 0 ? 'btn-secondary' : 'btn-success'}`}
                                                    onClick={(event) => handleOpenDelete(classGroup.id, event.target.name)}>
                                                    {classGroup.isClosed === 0 ? 'Close' : 'Open'}
                                                </Button>

                                                <Button className='btn btn-danger'
                                                    onClick={() => handleOpenDelete(classGroup.id)}>
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

export default ListClassGroups;