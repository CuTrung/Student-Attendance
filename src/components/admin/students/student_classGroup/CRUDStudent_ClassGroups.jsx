import CreateUpdateStudent_ClassGroup from "./createUpdateStudent_ClassGroup";
import ListStudent_ClassGroups from "./listStudent_ClassGroups";
import { useEffect, useState } from 'react';
import axios from '../../../../configs/axios';
import { toast } from 'react-toastify';

const CRUDStudent_ClassGroups = (props) => {
    const DELAY_API_TIME = import.meta.env.VITE_DELAY_API_TIME ?? 500;
    const [listStudent_ClassGroups, setListStudent_ClassGroups] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    const [isUpdate, setIsUpdate] = useState(false);
    const [student_classGroupUpdate, setStudent_ClassGroupUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const getStudent_ClassGroups = async () => {
        try {
            let data = await axios.get(`api/student_classGroups?page=${currentPage}&limit=${currentLimit}&delay=${DELAY_API_TIME}`);
            if (data && data.EC === 0) {
                toast.success(data.EM);
                setListStudent_ClassGroups(data.DT.student_classGroups);
                setTotalPages(data.DT.totalPages);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchStudent_ClassGroups = async () => {
        await getStudent_ClassGroups();
    }


    useEffect(() => {
        fetchStudent_ClassGroups();
    }, [currentPage])


    return (
        <>
            <div className='row'>
                <div className="col-5">
                    <CreateUpdateStudent_ClassGroup
                        fetchStudent_ClassGroups={fetchStudent_ClassGroups}
                        student_classGroupUpdate={student_classGroupUpdate}
                        setStudent_ClassGroupUpdate={setStudent_ClassGroupUpdate}
                        isUpdate={isUpdate}
                        isLoading={isLoading}
                        setIsUpdate={setIsUpdate}
                        listStudent_ClassGroups={listStudent_ClassGroups}
                    />
                </div>
                <div className="col-7">
                    <ListStudent_ClassGroups
                        listStudent_ClassGroups={listStudent_ClassGroups}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setStudent_ClassGroupUpdate={setStudent_ClassGroupUpdate}
                        setIsUpdate={setIsUpdate}
                        isLoading={isLoading}
                        fetchStudent_ClassGroups={fetchStudent_ClassGroups}
                    />
                </div>
            </div>
        </>
    )
}


export default CRUDStudent_ClassGroups;