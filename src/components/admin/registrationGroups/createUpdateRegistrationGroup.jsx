import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';
import validationUtils from '../../../utils/validationUtils';

const CreateUpdateRegistrationGroup = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);

    const handleClearForm = () => {
        setName('');
        setDescription('');
    }

    const handleSubmit = async () => {
        try {
            // let isValid = validationUtils.validate('createUpdateRegistrationGroup');
            if (true) {
                let data = await axios.post('api/registrationGroups', { name, description });
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchRegistrationGroups();
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
            // let isValid = validationUtils.validate('createUpdateRegistrationGroup');
            if (true) {
                let data = await axios.patch('api/registrationGroups', {
                    id: props.registrationGroupUpdate.id,
                    name,
                    description,
                });
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchRegistrationGroups();
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
        props.setRegistrationGroupUpdate({});
        props.setIsUpdate(false);
    }


    const handleEnter = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }


    useEffect(() => {
        setName(props.registrationGroupUpdate?.name);
        setDescription(props.registrationGroupUpdate?.description);
    }, [props.registrationGroupUpdate])

    return (
        <>
            {props.isUpdate ?
                <h3>Update a registrationGroup</h3>
                :
                <h3>Add new registrationGroup</h3>
            }
            <Form id='createUpdateRegistrationGroup' onKeyUp={(event) => handleEnter(event)}>
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


export default CreateUpdateRegistrationGroup;