import { NavLink, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState, useEffect, useMemo } from "react";
import Button from 'react-bootstrap/Button';
import _ from 'lodash';


const Header = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        let userLogin = JSON.parse(window.sessionStorage.getItem("user"));
        if (userLogin) {
            setUser(userLogin);
        } else {
            navigate('/login');
        }
    }, []);



    return (
        <Navbar bg="light" expand="lg">
            <Container className={`${_.isEmpty(user) ? '' : 'd-flex flex-row-reverse'}`}>
                {_.isEmpty(user) ?
                    <>
                        <Link className='navbar-brand' to='/'>Student attendance</Link>
                        <Navbar.Collapse id="basic-navbar-nav">
                            {/* <Nav className="me-auto">
                                <NavLink className='nav-link' to="/manage">Manage</NavLink>
                                <NavLink className='nav-link' to="/admin">Admin</NavLink>
                                <NavLink className='nav-link' to="/attendance">Attendance</NavLink>
                            </Nav> */}

                            <Nav className="me-auto">
                                <NavLink className='nav-link' to="/">Home</NavLink>
                                <NavLink className='nav-link' to="/about">About</NavLink>
                            </Nav>

                            <NavLink className='nav-link' to="/login">Login</NavLink>
                        </Navbar.Collapse>
                    </>
                    :
                    <Nav>
                        <NavDropdown title={`Hi ${user.fullName}`} id="basic-nav-dropdown">
                            <Link className="dropdown-item" to="/profile">Profile</Link>
                            <Link className="dropdown-item" to="/">Logout</Link>
                        </NavDropdown>
                    </Nav>
                }
            </Container>
        </Navbar>
    );
}

export default Header;