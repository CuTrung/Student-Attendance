import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';
import validationUtils from '../../../utils/validationUtils';

const CreateUpdateDepartment = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);

    const handleClearForm = () => {
        setName('');
        setDescription('');
    }

    const handleSubmit = async () => {
        try {
            // let isValid = validationUtils.validate('createUpdateDepartment');
            if (true) {
                let data = await axios.post('api/departments', { name, description });
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchDepartments();
                    handleClearForm();
                    toast.success(data.EM);
                } else {
                    setIsWaiting(true);
                    toast.error(data.EM);
                }
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error)
        }
    }

    const handleSave = async () => {
        try {
            // let isValid = validationUtils.validate('createUpdateDepartment');
            if (true) {
                let data = await axios.patch('api/departments', {
                    id: props.departmentUpdate.id,
                    name,
                    description,
                });
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchDepartments();
                    handleClearForm();
                    props.setIsUpdate(false);
                    toast.success(data.EM);
                } else {
                    setIsWaiting(true);
                    toast.error(data.EM);
                }
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error)
        }
    }

    const handleCancel = () => {
        handleClearForm();
        props.setDepartmentUpdate({});
        props.setIsUpdate(false);
    }


    const handleEnter = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }


    useEffect(() => {
        setName(props.departmentUpdate?.name);
        setDescription(props.departmentUpdate?.description);
    }, [props.departmentUpdate])

    return (
        <>
            {props.isUpdate ?
                <h3>Update a department</h3>
                :
                <h3>Add new department</h3>
            }
            <Form id='createUpdateDepartment' onKeyUp={(event) => handleEnter(event)}>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Name"
                    className="mb-3"
                >
                    <Form.Control
                        type="text" placeholder="name@example.com"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Description"
                    className="mb-3"
                >
                    <Form.Control
                        type="text" placeholder="name@example.com"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </FloatingLabel>

                {props.isUpdate ?
                    <>
                        <Button
                            disabled={isWaiting}
                            className='me-3' variant="success" type="button"
                            onClick={() => handleSave()}
                        >
                            Save
                        </Button>
                        <Button
                            className='me-3' variant="danger" type="button"
                            onClick={() => handleCancel()}
                        >
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
                        <Button
                            className='me-3' variant="warning" type="button"
                            onClick={() => handleClearForm()}
                        >
                            Clear Form
                        </Button>
                    </>
                }

            </Form>
        </>
    )
}


export default CreateUpdateDepartment;