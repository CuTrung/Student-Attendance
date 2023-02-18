import CreateUpdateRegistrationGroup from "./createUpdateRegistrationGroup";
import ListRegistrationGroups from "./listRegistrationGroups";
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';

const CRUDRegistrationGroups = (props) => {
    const DELAY_API_TIME = import.meta.env.VITE_DELAY_API_TIME ?? 500;
    const [listRegistrationGroups, setListRegistrationGroups] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(0);

    const [isUpdate, setIsUpdate] = useState(false);
    const [registrationGroupUpdate, setRegistrationGroupUpdate] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const getRegistrationGroups = async () => {
        try {
            let data = await axios.get(`api/registrationGroups?page=${currentPage}&limit=${currentLimit}&delay=${DELAY_API_TIME}`);
            if (data && data.EC === 0) {
                toast.success(data.EM);
                setListRegistrationGroups(data.DT.registrationGroups);
                setTotalPages(data.DT.totalPages);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchRegistrationGroups = async () => {
        await getRegistrationGroups();
    }


    useEffect(() => {
        fetchRegistrationGroups();
    }, [currentPage])


    return (
        <>
            <div className='row'>
                <div className="col-5">
                    <CreateUpdateRegistrationGroup
                        fetchRegistrationGroups={fetchRegistrationGroups}
                        registrationGroupUpdate={registrationGroupUpdate}
                        setRegistrationGroupUpdate={setRegistrationGroupUpdate}
                        isUpdate={isUpdate}
                        isLoading={isLoading}
                        setIsUpdate={setIsUpdate}
                    />
                </div>
                <div className="col-7">
                    <ListRegistrationGroups
                        listRegistrationGroups={listRegistrationGroups}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setRegistrationGroupUpdate={setRegistrationGroupUpdate}
                        setIsUpdate={setIsUpdate}
                        isLoading={isLoading}
                        fetchRegistrationGroups={fetchRegistrationGroups}
                    />
                </div>
            </div>
        </>
    )
}


export default CRUDRegistrationGroups;