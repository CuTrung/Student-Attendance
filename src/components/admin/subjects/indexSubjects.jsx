import Accordion from 'react-bootstrap/Accordion';
import CRUDSubjects from './CRUDSubjects';
import ListSubjects from './listSubjects';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const IndexSubjects = () => {
    return (
        <>
            <CRUDSubjects />
        </>
    )
}

export default IndexSubjects;