import CRUDTeacher from "./CRUDTeachers";
import ManageTeachers from "./manageTeachers";
import Accordion from 'react-bootstrap/Accordion';
import { useEffect } from "react";

const IndexTeachers = (props) => {


    useEffect(() => {
        document.querySelector('.accordion-button').click();
    }, [])

    return (
        <Accordion className='my-3'>
            <Accordion.Item eventKey="0">
                <Accordion.Header>CRUD Teacher</Accordion.Header>
                <Accordion.Body>
                    <CRUDTeacher />
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Manage Teachers</Accordion.Header>
                <Accordion.Body>
                    <ManageTeachers />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}


export default IndexTeachers;