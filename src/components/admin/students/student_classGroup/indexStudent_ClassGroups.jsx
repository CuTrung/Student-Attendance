import Accordion from 'react-bootstrap/Accordion';
import CRUDStudent_ClassGroups from './CRUDStudent_ClassGroups';
import ListClassGroups from './listStudent_ClassGroups';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const IndexStudent_ClassGroups = () => {
    return (
        <>
            <CRUDStudent_ClassGroups />
        </>
    )
}

export default IndexStudent_ClassGroups;