import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useEffect, useState } from "react";
import axios from '../../../configs/axios';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import validationUtils from '../../../utils/validationUtils';

const Attendance = (props) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const [classGroupCode, setClassGroupCode] = useState("");
    const [user, setUser] = useState({});

    // Nhận data từ useNavigate;
    const { pathname, state } = useLocation();

    const handleAttendance = async () => {
        try {
            let isValid = validationUtils.validate("attendanceForm", 'code');
            // setUser(JSON.parse(window.sessionStorage.getItem("user")));
            if (isValid && user?.email) {
                // setIsWaiting(true);
                let data = await axios.post('api/attendance', {
                    showCode: classGroupCode,
                });

                if (data && data.EC === 0) {
                    // window.sessionStorage.setItem("user", JSON.stringify(data.DT))
                    toast.success(data.EM);
                    setClassGroupCode("");
                } else {
                    // setIsWaiting(false);
                    toast.error(data.EM);
                }
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error);
        }
    }


    const handleEnter = (event) => {
        if (event.key === "Enter") {
            handleAttendance()
        }
    }

    useEffect(() => {
        setUser(state?.student);
    }, [state])


    return (
        <>
            <div className="formLogin container w-50 text-center">
                <h3 className="my-3 text-success">Attendance</h3>
                <Form id='attendanceForm'
                    onKeyUp={(event) => handleEnter(event)}
                    onSubmit={(event) => event.preventDefault()}
                >
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Enter class code"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            placeholder="name@example.com"
                            name='code'
                            value={classGroupCode}
                            onChange={(event) => setClassGroupCode(event.target.value)}
                        // onChange={(event) => handleOnChange(event)}
                        />
                    </FloatingLabel>

                    <Button disabled={isWaiting} className='btn w-100 mb-3' variant="primary" type="button" onClick={() => handleAttendance()}>
                        Attendance
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default Attendance;