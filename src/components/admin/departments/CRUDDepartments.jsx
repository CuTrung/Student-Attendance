import CreateUpdateDepartment from "./createUpdateDepartment";
import ListDepartments from "./listDepartments";
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';

const CRUDDepartments = (props) => {
    const DELAY_API_TIME = import.meta.env.VITE_DELAY_API_TIME ?? 500;
    const [listDepartments, setListDepartments] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    const [isUpdate, setIsUpdate] = useState(false);
    const [departmentUpdate, setDepartmentUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const getDepartments = async () => {
        try {
            let data = await axios.get(`api/departments?page=${currentPage}&limit=${currentLimit}&delay=${DELAY_API_TIME}`);
            if (data && data.EC === 0) {
                toast.success(data.EM);
                setListDepartments(data.DT.departments);
                setTotalPages(data.DT.totalPages);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchDepartments = async () => {
        await getDepartments();
    }


    useEffect(() => {
        fetchDepartments();
    }, [currentPage])


    return (
        <>
            <div className='row'>
                <div className="col-5">
                    <CreateUpdateDepartment
                        fetchDepartments={fetchDepartments}
                        departmentUpdate={departmentUpdate}
                        setDepartmentUpdate={setDepartmentUpdate}
                        isUpdate={isUpdate}
                        isLoading={isLoading}
                        setIsUpdate={setIsUpdate}
                    />
                </div>
                <div className="col-7">
                    <ListDepartments
                        listDepartments={listDepartments}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setDepartmentUpdate={setDepartmentUpdate}
                        setIsUpdate={setIsUpdate}
                        isLoading={isLoading}
                        fetchDepartments={fetchDepartments}
                    />
                </div>
            </div>
        </>
    )
}


export default CRUDDepartments;