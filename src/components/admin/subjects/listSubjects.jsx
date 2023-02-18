import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';
import MyPagination from '../../both/pagination';
import '../../../assets/scss/admin/subjects/listSubjects.scss';
import LoadingIcon from '../../both/loadingIcon';



const ListSubjects = (props) => {


    const handleEdit = async (subject) => {
        await props.setSubjectUpdate(subject);
        props.setIsUpdate(true);
    }

    const handleOpenDelete = async (subjectId, type) => {
        try {
            let isClosed;
            if (type) {
                isClosed = type === 'OPEN' ? '0' : '1';
            }

            let data = await axios.delete('api/subjects', {
                data: { id: subjectId, isClosed },
            });
            if (data && data.EC === 0) {
                toast.success(data.EM);
                props.fetchSubjects();
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
                    <Table className='listSubjects' bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Majors</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.listSubjects && props.listSubjects.length > 0
                                && props.listSubjects.map((subject, index) => {
                                    return (
                                        <tr key={`subject-${index + 1}`}>
                                            <td>{subject.name}</td>
                                            <td>{subject.description}</td>
                                            <td>
                                                {subject.Majors && subject.Majors.length > 0 &&
                                                    subject.Majors.map((major, index) => {
                                                        return (
                                                            <p key={`major-${index + 1}`} className='mb-0 mb-2'>
                                                                {subject.Majors.length > 1 ?
                                                                    <><strong>{index + 1}. </strong>{major.description}</>
                                                                    :
                                                                    `${major.description}`
                                                                }
                                                            </p>
                                                        )
                                                    })
                                                }
                                            </td>

                                            <td className='d-flex gap-1'>
                                                <Button
                                                    variant="warning" type="button"
                                                    onClick={() => handleEdit(subject)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    name={subject.isClosed === 0 ? 'ClOSE' : 'OPEN'}
                                                    className={`btn ${subject.isClosed === 0 ? 'btn-secondary' : 'btn-success'}`}
                                                    onClick={(event) => handleOpenDelete(subject.id, event.target.name)}>
                                                    {subject.isClosed === 0 ? 'Close' : 'Open'}
                                                </Button>

                                                <Button className='btn btn-danger'
                                                    onClick={() => handleOpenDelete(subject.id)}>
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

export default ListSubjects;