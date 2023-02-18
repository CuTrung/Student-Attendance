import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useImperativeHandle, useState, forwardRef } from 'react';
import axios from '../../../configs/axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import validationUtils from '../../../utils/validationUtils';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import '../../../assets/scss/admin/students/createUpdateStudent.scss';


const CreateUpdateStudent = (props) => {
    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
    const [fullName, setFullName] = useState("");
    const [schoolYear, setSchoolYear] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [major, setMajor] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Waiting when submit or save
    const [isWaiting, setIsWaiting] = useState(false);


    const handleClearForm = () => {
        setFullName('');
        setEmail('');
        setMajor('');
        setPassword('');
        setSchoolYear('');
    }

    const handleOnChange = (event) => {
        if (event.target.classList.contains('is-invalid')) {
            event.target.classList.remove('is-invalid')
        }
        switch (event.target.name) {
            case 'fullName':
                setFullName(event.target.value);
                break;
            case 'email':
                setEmail(event.target.value);
                break;
            case 'major':
                setMajor(event.target.value);
                break;
            case 'password':
                setPassword(event.target.value);
                break;
            case 'schoolYear':
                setSchoolYear(event.target.value);
                break;
            default:
                break;
        }
    }


    const handleSubmit = async () => {
        try {
            // let isValid = validationUtils.validate("createUpdateForm");
            if (true) {
                setIsWaiting(true);
                let data = await axios.post('api/students', {
                    fullName,
                    schoolYearId: +schoolYear,
                    majorId: +major,
                    email,
                    password
                });

                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    toast.success(data.EM);
                    handleClearForm();
                    props.fetchStudents();
                } else {
                    setIsWaiting(false);
                    toast.error(data.EM);
                }
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error);
        }
    }

    const handleSave = async () => {
        try {
            // let isValid = validationUtils.validate("createUpdateForm");
            if (true) {
                setIsWaiting(true);
                let data = await axios.patch('api/students', {
                    emailUpdate: props.studentUpdate.email,
                    fullName,
                    schoolYearId: +schoolYear,
                    majorId: +major,
                    email,
                    password
                });
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    toast.success(data.EM);
                    handleClearForm();
                    props.setIsUpdate(false);
                    document.querySelector('.accordion-button').click();
                    props.fetchStudents();
                } else {
                    setIsWaiting(false);
                    toast.error(data.EM);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancel = () => {
        handleClearForm();
        // set về {} để thay đổi props.studentUpdate, tránh lỗi khi click cancel 
        // xong click lại edit component ko re-render  
        props.setStudentUpdate({});
        props.setIsUpdate(false);
    }

    const handleEnter = (event) => {
        if (event.key === "Enter") {
            if (props.isUpdate)
                handleSave();
            handleSubmit();
        }
    }

    // Có warning ở đây, có thể là render quá nhiều lần, improve with redux
    useEffect(() => {
        setFullName(props.studentUpdate.fullName);
        setEmail(props.studentUpdate.email);
        setMajor(props.studentUpdate.Major?.id);
        setPassword(props.studentUpdate.password?.split(SECRET_KEY)[1]);
        setSchoolYear(props.studentUpdate.SchoolYear?.id);
    }, [props.studentUpdate])


    return (
        <>
            {props.isUpdate ?
                <h3>Update Student:&nbsp;<span className='text-danger'>{fullName}</span></h3>
                :
                <h3>Add New Student</h3>
            }
            <Form id='createUpdateForm' onKeyUp={(event) => handleEnter(event)}>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Full Name"
                    className="mb-3"
                >
                    <Form.Control
                        type="text"
                        placeholder="Nguyen Van A"
                        name='fullName'
                        value={fullName}
                        // onChange={(e) => setFullName(e.target.value)}
                        onChange={(event) => handleOnChange(event)}
                    />
                </FloatingLabel>

                <Form.Select
                    className="mb-3"
                    aria-label="Default select example"
                    name='schoolYear'
                    onChange={(event) => handleOnChange(event)}
                    value={schoolYear}
                >
                    <option value={''}>School Year</option>
                    {props.schoolYears && props.schoolYears.length > 0
                        && props.schoolYears.map((schoolYear, index) => {
                            return (
                                <option
                                    key={`schoolYear-${index}`}
                                    value={schoolYear.id}
                                >{schoolYear.description}</option>
                            )
                        })
                    }
                </Form.Select>

                <Form.Select
                    className="mb-3"
                    aria-label="Default select example"
                    name='major'
                    value={major}
                    onChange={(event) => handleOnChange(event)}
                >
                    <option value={''}>Major</option>
                    {props.majors && props.majors.length > 0
                        && props.majors.map((major, index) => {
                            return (
                                <option
                                    key={`major-${index}`}
                                    value={major.id}
                                >{major.description}</option>
                            )
                        })
                    }
                </Form.Select>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Email"
                    className="mb-3"
                >
                    <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        name='email'
                        value={email}
                        onChange={(event) => handleOnChange(event)}
                    />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Password"
                    className="mb-3 position-relative"
                >
                    <Form.Control
                        type={showPassword ? "password" : "text"}
                        placeholder="name@example.com"
                        name='password'
                        value={password}
                        onChange={(event) => handleOnChange(event)}
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="eye position-absolute top-50 end-0 translate-middle-y">
                        {showPassword ?
                            <FaEye size={'24px'} />
                            :
                            <FaEyeSlash size={'24px'} />
                        }
                    </span>
                </FloatingLabel>

                {props.isUpdate ?
                    <>
                        <Button disabled={isWaiting} className='me-3' variant="success" type="button" onClick={() => handleSave()}>
                            Save
                        </Button>
                        <Button variant="danger" type="button" onClick={() => handleCancel()}>
                            Cancel
                        </Button>
                    </>
                    :
                    <>
                        <Button
                            disabled={props.isLoading ? props.isLoading : isWaiting}
                            className='me-3' variant="primary" type="button"
                            onClick={() => handleSubmit()}
                        >
                            Submit
                        </Button>
                        <Button variant="warning" type="button" onClick={() => handleClearForm()}>
                            Clear Form
                        </Button>
                    </>
                }

            </Form>
        </>
    )
}

export default CreateUpdateStudent;