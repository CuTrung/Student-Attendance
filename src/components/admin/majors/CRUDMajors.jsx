import CreateUpdateMajor from "./createUpdateMajor";
import ListMajors from "./listMajors";
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';

const CRUDMajors = (props) => {
    const DELAY_API_TIME = import.meta.env.VITE_DELAY_API_TIME ?? 500;
    const [listMajors, setListMajors] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    const [isUpdate, setIsUpdate] = useState(false);
    const [majorUpdate, setMajorUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const getMajors = async () => {
        try {
            let data = await axios.get(`api/majors?page=${currentPage}&limit=${currentLimit}&delay=${DELAY_API_TIME}`);
            if (data && data.EC === 0) {
                toast.success(data.EM);
                setListMajors(data.DT.majors);
                setTotalPages(data.DT.totalPages);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchMajors = async () => {
        await getMajors();
    }


    useEffect(() => {
        fetchMajors();
    }, [currentPage])


    return (
        <>
            <div className='row'>
                <div className="col-5">
                    <CreateUpdateMajor
                        fetchMajors={fetchMajors}
                        majorUpdate={majorUpdate}
                        setMajorUpdate={setMajorUpdate}
                        isUpdate={isUpdate}
                        isLoading={isLoading}
                        setIsUpdate={setIsUpdate}
                    />
                </div>
                <div className="col-7">
                    <ListMajors
                        listMajors={listMajors}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setMajorUpdate={setMajorUpdate}
                        setIsUpdate={setIsUpdate}
                        isLoading={isLoading}
                        fetchMajors={fetchMajors}
                    />
                </div>
            </div>
        </>
    )
}


export default CRUDMajors;