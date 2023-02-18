import CreateUpdateTeacher from './createUpdateTeacher';
import ListTeachers from './listTeachers';
import axios from '../../../configs/axios';
import { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import _ from 'lodash';

const CRUDTeacher = (props) => {
    const DELAY_API_TIME = import.meta.env.VITE_DELAY_API_TIME ?? 500;
    const [listTeachers, setListTeachers] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [teacherUpdate, setTeacherUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(7);
    const [totalPages, setTotalPages] = useState(0);


    const getTeachers = async () => {
        try {
            let data = await axios.get(`api/teachers?page=${currentPage}&limit=${currentLimit}&delay=${DELAY_API_TIME}`);

            if (data && data.EC === 0) {
                toast.success(data.EM);
                setListTeachers(data.DT.teachers);
                setTotalPages(data.DT.totalPages);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const getTeacherUpdate = (teacher) => {
        setTeacherUpdate(teacher);
    }

    const fetchTeachers = async () => {
        await getTeachers();
    }

    useEffect(() => {
        fetchTeachers();
    }, [currentPage])


    return (
        <>
            <CreateUpdateTeacher
                listTeachers={listTeachers}
                fetchTeachers={fetchTeachers}
                isUpdate={isUpdate}
                setIsUpdate={setIsUpdate}
                teacherUpdate={teacherUpdate}
                setTeacherUpdate={setTeacherUpdate}
                isLoading={isLoading}
            />
            <ListTeachers
                listTeachers={listTeachers}
                fetchTeachers={fetchTeachers}
                setIsUpdate={setIsUpdate}
                getTeacherUpdate={getTeacherUpdate}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                isLoading={isLoading}
            />
        </>
    )
}

export default CRUDTeacher;