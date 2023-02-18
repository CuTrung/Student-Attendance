import Accordion from 'react-bootstrap/Accordion';
import CRUDRegistrationGroups from './CRUDRegistrationGroups';
import ListRegistrationGroups from './listRegistrationGroups';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const IndexRegistrationGroups = () => {
    return (
        <>
            <CRUDRegistrationGroups />
        </>
    )
}

export default IndexRegistrationGroups;