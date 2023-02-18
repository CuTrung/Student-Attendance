import Accordion from 'react-bootstrap/Accordion';
import CRUDClassGroups from './CRUDClassGroups';
import ListClassGroups from './listClassGroups';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const IndexClassGroups = () => {
    return (
        <>
            <CRUDClassGroups />
        </>
    )
}

export default IndexClassGroups;