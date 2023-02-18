import CreateUpdateStudent from './createUpdateStudent';
import ListStudents from './listStudents';
import axios from '../../../configs/axios';
import { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import _ from 'lodash';

const CRUDStudent = (props) => {
    const DELAY_API_TIME = import.meta.env.VITE_DELAY_API_TIME ?? 500;
    const [listStudents, setListStudents] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [majors, setMajors] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [studentUpdate, setStudentUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(7);
    const [totalPages, setTotalPages] = useState(0);


    const getStudents = async () => {
        try {
            let data = await axios.get(`api/students?page=${currentPage}&limit=${currentLimit}&delay=${DELAY_API_TIME}`);
            if (data && data.EC === 0) {
                toast.success(data.EM);
                setListStudents(data.DT.students);
                setTotalPages(data.DT.totalPages);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const getAllSchoolYears = async () => {
        try {
            let data = await axios.get(`api/schoolYears`);
            if (data && data.EC === 0) {
                toast.success(data.EM);
                setSchoolYears(data.DT);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Nên để redux quản lí vì còn sài ở component Manage
    const getAllMajors = async () => {
        try {
            let data = await axios.get(`api/majors`);
            if (data && data.EC === 0) {
                toast.success(data.EM);
                setMajors(data.DT);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getStudentUpdate = (student) => {
        setStudentUpdate(student);
    }

    const fetchStudents = async () => {
        await getStudents();
    }

    useEffect(() => {
        getAllSchoolYears();
        getAllMajors();
    }, [])

    useEffect(() => {
        fetchStudents();
    }, [currentPage])


    return (
        <>
            <CreateUpdateStudent
                majors={majors}
                schoolYears={schoolYears}
                listStudents={listStudents}
                fetchStudents={fetchStudents}
                isUpdate={isUpdate}
                setIsUpdate={setIsUpdate}
                studentUpdate={studentUpdate}
                setStudentUpdate={setStudentUpdate}
                isLoading={isLoading}
            />
            <ListStudents
                listStudents={listStudents}
                fetchStudents={fetchStudents}
                setIsUpdate={setIsUpdate}
                getStudentUpdate={getStudentUpdate}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                isLoading={isLoading}
            />
        </>
    )
}

export default CRUDStudent;