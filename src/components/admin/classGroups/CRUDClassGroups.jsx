import CreateUpdateClassGroup from "./createUpdateClassGroup";
import ListClassGroups from "./listClassGroups";
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';

const CRUDClassGroups = (props) => {
    const DELAY_API_TIME = import.meta.env.VITE_DELAY_API_TIME ?? 500;
    const [listClassGroups, setListClassGroups] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    const [isUpdate, setIsUpdate] = useState(false);
    const [classGroupUpdate, setClassGroupUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const getClassGroups = async () => {
        try {
            let data = await axios.get(`api/classGroups?page=${currentPage}&limit=${currentLimit}&delay=${DELAY_API_TIME}`);

            if (data && data.EC === 0) {
                toast.success(data.EM);
                setListClassGroups(data.DT.classGroups);
                setTotalPages(data.DT.totalPages);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchClassGroups = async () => {
        await getClassGroups();
    }


    useEffect(() => {
        fetchClassGroups();
    }, [currentPage])


    return (
        <>
            <div className='row'>
                <div className="col-5">
                    <CreateUpdateClassGroup
                        fetchClassGroups={fetchClassGroups}
                        classGroupUpdate={classGroupUpdate}
                        setClassGroupUpdate={setClassGroupUpdate}
                        isUpdate={isUpdate}
                        isLoading={isLoading}
                        setIsUpdate={setIsUpdate}
                        listClassGroups={listClassGroups}
                    />
                </div>
                <div className="col-7">
                    <ListClassGroups
                        listClassGroups={listClassGroups}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setClassGroupUpdate={setClassGroupUpdate}
                        setIsUpdate={setIsUpdate}
                        isLoading={isLoading}
                        fetchClassGroups={fetchClassGroups}
                    />
                </div>
            </div>
        </>
    )
}


export default CRUDClassGroups;