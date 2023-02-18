import Nav from 'react-bootstrap/Nav';
import { NavLink } from "react-router-dom";
import '../../assets/scss/admin/sidebar.scss';

const Sidebar = () => {
    return (
        <>
            <button className='btn btn-success w-100'>Logo</button>
            <Nav defaultActiveKey="/home" className="flex-column text-center border border-1">
                <NavLink className='nav-link btn btn-light' to='students'>Students</NavLink>
                <NavLink className='nav-link btn btn-light' to='teachers'>Teachers</NavLink>
                <NavLink className='nav-link btn btn-light' to='departments'>Departments</NavLink>
            </Nav>
        </>
    );
}

export default Sidebar;