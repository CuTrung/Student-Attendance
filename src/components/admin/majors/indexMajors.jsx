import Accordion from 'react-bootstrap/Accordion';
import CRUDMajors from './CRUDMajors';
import ListMajors from './listMajors';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const IndexMajors = () => {
    return (
        <>
            <CRUDMajors />
        </>
    )
}

export default IndexMajors;