import CreateUpdateSubject from "./createUpdateSubject";
import ListSubjects from "./listSubjects";
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';

const CRUDSubjects = (props) => {
    const DELAY_API_TIME = import.meta.env.VITE_DELAY_API_TIME ?? 500;
    const [listSubjects, setListSubjects] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(4);
    const [totalPages, setTotalPages] = useState(0);

    const [isUpdate, setIsUpdate] = useState(false);
    const [subjectUpdate, setSubjectUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const getSubjects = async () => {
        try {
            let data = await axios.get(`api/subjects?page=${currentPage}&limit=${currentLimit}&delay=${DELAY_API_TIME}`);

            if (data && data.EC === 0) {
                toast.success(data.EM);
                setListSubjects(data.DT.subjects);
                setTotalPages(data.DT.totalPages);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSubjects = async () => {
        await getSubjects();
    }


    useEffect(() => {
        fetchSubjects();
    }, [currentPage])


    return (
        <>
            <div className='row'>
                <div className="col-5">
                    <CreateUpdateSubject
                        fetchSubjects={fetchSubjects}
                        subjectUpdate={subjectUpdate}
                        setSubjectUpdate={setSubjectUpdate}
                        isUpdate={isUpdate}
                        isLoading={isLoading}
                        setIsUpdate={setIsUpdate}
                    />
                </div>
                <div className="col-7">
                    <ListSubjects
                        listSubjects={listSubjects}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setSubjectUpdate={setSubjectUpdate}
                        setIsUpdate={setIsUpdate}
                        isLoading={isLoading}
                        fetchSubjects={fetchSubjects}
                    />
                </div>
            </div>
        </>
    )
}


export default CRUDSubjects;