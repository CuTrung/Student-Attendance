import Nav from 'react-bootstrap/Nav';
import { NavLink } from "react-router-dom";
import '../../../assets/scss/user/students/sidebar.scss';

const Sidebar = () => {
    return (
        <>
            <button className='btn btn-success w-100'>Logo</button>
            <Nav defaultActiveKey="" className="flex-column text-center border border-1">
                <NavLink className='nav-link btn btn-light' to='attendance'>Attendance</NavLink>
                <NavLink className='nav-link btn btn-light' to='profile'>Profile</NavLink>
            </Nav>
        </>
    );
}

export default Sidebar;