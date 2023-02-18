import Accordion from 'react-bootstrap/Accordion';
import CRUDDepartments from './CRUDDepartments';
import ListDepartments from './listDepartments';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const IndexDepartments = () => {
    return (
        <>
            <div className='btn-group d-flex justify-content-center my-3' role="group" >
                <NavLink className='btn btn-outline-info me-3' to='majors'>Major</NavLink>
                <NavLink className='btn btn-outline-info me-3' to='subjects'>Subject</NavLink>
                <NavLink className='btn btn-outline-info me-3' to='registrationGroups'>Registration Group</NavLink>
                <NavLink className='btn btn-outline-info me-3' to='classGroups'>Class Group</NavLink>
            </div>

            <Outlet />

        </>
    )
}

export default IndexDepartments;