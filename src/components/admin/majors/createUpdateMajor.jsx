import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';
import validationUtils from '../../../utils/validationUtils';
import { FcPlus } from 'react-icons/fc';
import { MdDeleteForever } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';


const CreateUpdateMajor = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [listDepartments, setListDepartments] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);

    const initDepartments = [
        {
            id: uuidv4(),
            departmentId: '',
            majors: [
                {
                    id: uuidv4(),
                    name: '',
                    description: '',
                }
            ]
        },
    ];

    const [departments, setDepartments] = useState(initDepartments)

    const handleClearForm = () => {
        setName('');
        setDescription('');
        setDepartmentId('');
    }

    const handleSubmit = async () => {
        try {
            // let isValid = validationUtils.validate('createUpdateMajor');
            if (true) {
                let listMajors = departments.reduce((acc, cur) => {
                    let majors = cur.majors.map(major => {
                        return {
                            name: major.name,
                            description: major.description,
                            departmentId: +cur.departmentId
                        }
                    })
                    return acc.concat(majors)
                }, [])

                let data = await axios.post('api/majors', [...listMajors]);
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchMajors();
                    // handleClearForm();
                    setDepartments(initDepartments);
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
            // let isValid = validationUtils.validate('createUpdateMajor');
            if (true) {
                let data = await axios.patch('api/majors', {
                    id: props.majorUpdate.id,
                    name,
                    description,
                    departmentId
                });
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchMajors();
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

    const getAllDepartments = async () => {
        try {
            let data = await axios.get('api/departments');
            if (data && data.EC === 0) {
                setListDepartments(data.DT)
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error)
        }
    }

    const handleAddRemoveDepartment = (type, departmentId) => {
        if (type === 'ADD') {
            const newDepartment = {
                id: uuidv4(),
                departmentId: '',
                majors: [
                    {
                        id: uuidv4(),
                        name: '',
                        description: '',
                    }
                ]
            }

            setDepartments([...departments, newDepartment])
        }

        if (type === 'REMOVE') {
            let cloneDepartments = _.cloneDeep(departments);

            cloneDepartments = cloneDepartments.filter(department => department.id !== departmentId)

            setDepartments(cloneDepartments);
        }
    }

    const handleAddRemoveMajor = (type, departmentId, majorId) => {
        if (type === 'ADD') {
            let cloneDepartments = _.cloneDeep(departments);

            let departmentIndex = cloneDepartments.findIndex(department => department.id === departmentId)

            if (departmentIndex > -1) {
                const newMajor = {
                    id: uuidv4(),
                    name: '',
                    description: '',
                }
                cloneDepartments[departmentIndex].majors.push(newMajor);
                setDepartments(cloneDepartments);
            }
        }

        if (type === 'REMOVE') {
            let cloneDepartments = _.cloneDeep(departments);

            let departmentIndex = cloneDepartments.findIndex(department => department.id === departmentId)

            if (departmentIndex > -1) {
                cloneDepartments[departmentIndex].majors = cloneDepartments[departmentIndex].majors.filter(major => major.id !== majorId)
                setDepartments(cloneDepartments);
            }
        }
    }



    const handleOnChange = (type, departmentId, majorId, field, value) => {
        if (type === 'DEPARTMENT') {
            console.log(">>> Check value", value)
            let cloneDepartments = _.cloneDeep(departments);

            let departmentIndex = cloneDepartments.findIndex(department => department.id === departmentId)

            if (departmentIndex > -1) {
                cloneDepartments[departmentIndex].departmentId = value;
                setDepartments(cloneDepartments);
            }
        }

        if (type === 'MAJOR') {
            let cloneDepartments = _.cloneDeep(departments);

            let departmentIndex = cloneDepartments.findIndex(department => department.id === departmentId)

            if (departmentIndex > -1) {
                let majorIndex = cloneDepartments[departmentIndex].majors.findIndex(major => major.id === majorId)

                if (majorIndex > -1) {
                    cloneDepartments[departmentIndex].majors[majorIndex][field] = value;
                    setDepartments(cloneDepartments);
                }

            }
        }
    }

    const handleCancel = () => {
        setDepartments(initDepartments);
        props.setMajorUpdate({});
        props.setIsUpdate(false);
    }


    const handleEnter = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }

    useEffect(() => {
        getAllDepartments();
    }, [])

    useEffect(() => {
        setName(props.majorUpdate?.name);
        setDescription(props.majorUpdate?.description);
        setDepartmentId(props.majorUpdate?.Department?.id);
    }, [props.majorUpdate])


    return (
        <>
            {props.isUpdate ?
                <h3>Update a major</h3>
                :
                <h3>Add new major</h3>
            }

            <Form id='createUpdateMajor' onKeyUp={(event) => handleEnter(event)}>
                {props.isUpdate ?
                    <>
                        <Form.Select
                            className="mb-3 w-75"
                            aria-label="Default select example"
                            name='department'
                            onChange={(event) => setDepartmentId(event.target.value)}
                            value={departmentId}
                        >
                            <option value={''}>Department</option>
                            {listDepartments.length > 0
                                && listDepartments.map((departmentItem, indexItem) => {
                                    return (
                                        <option
                                            key={`department-${indexItem}`}
                                            value={departmentItem.id}
                                        >{departmentItem.description}</option>
                                    )
                                })
                            }
                        </Form.Select>
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
                    </>
                    :
                    <>
                        {departments.length > 0
                            && departments.map((department, index) => {
                                return (
                                    <span key={`department-${index + 1}`}>
                                        <span className='d-flex gap-2'>
                                            <Form.Select
                                                className="mb-3 w-75"
                                                aria-label="Default select example"
                                                name='department'
                                                onChange={(event) => handleOnChange('DEPARTMENT', department.id, '', '', event.target.value)}
                                                value={department.departmentId}
                                            >
                                                <option value={''}>Department's {index + 1}</option>
                                                {listDepartments.length > 0
                                                    && listDepartments.map((departmentItem, indexItem) => {
                                                        return (
                                                            <option
                                                                key={`department-${indexItem}`}
                                                                value={departmentItem.id}
                                                            >{departmentItem.description}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Select>

                                            <span onClick={() => handleAddRemoveDepartment('ADD')} className='mt-1 h-100' role="button" >
                                                <FcPlus size={'24px'} />
                                            </span>

                                            {departments.length > 1 &&
                                                <span onClick={() => handleAddRemoveDepartment('REMOVE', department.id)} className='text-danger h-100' role="button">
                                                    <MdDeleteForever size={'32px'} />
                                                </span>
                                            }
                                        </span>

                                        {department.majors.length > 0 &&
                                            department.majors.map((major, index) => {
                                                return (
                                                    <span key={`major-${index + 1}`} >
                                                        <span className='d-flex gap-2'>
                                                            <FloatingLabel
                                                                controlId="floatingInput"
                                                                label={`Name's ${index + 1}`}
                                                                className="mb-3 w-75"
                                                            >
                                                                <Form.Control
                                                                    name='name'
                                                                    type="text" placeholder="name@example.com"
                                                                    value={major.name}
                                                                    onChange={(event) => handleOnChange('MAJOR', department.id, major.id, event.target.name, event.target.value)}
                                                                />
                                                            </FloatingLabel>

                                                            <span onClick={() => handleAddRemoveMajor('ADD', department.id)} className='mt-3 h-100' role="button" >
                                                                <FcPlus size={'24px'} />
                                                            </span>
                                                            {department.majors.length > 1 &&
                                                                <span onClick={() => handleAddRemoveMajor('REMOVE', department.id, major.id)} className='text-danger mt-2 pt-1 h-100' role="button">
                                                                    <MdDeleteForever size={'32px'} />
                                                                </span>
                                                            }
                                                        </span>


                                                        <FloatingLabel
                                                            controlId="floatingInput"
                                                            label={`Description's ${index + 1}`}
                                                            className="mb-3"
                                                        >
                                                            <Form.Control
                                                                name='description'
                                                                type="text" placeholder="name@example.com"
                                                                value={major.description}
                                                                onChange={(event) => handleOnChange('MAJOR', department.id, major.id, event.target.name, event.target.value)}
                                                            />
                                                        </FloatingLabel>
                                                    </span>
                                                )
                                            })
                                        }


                                        <hr key={`hr-${index + 1}`} className='text-danger' />
                                    </span>
                                )
                            })
                        }
                    </>
                }


            </Form>

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

        </>
    )
}


export default CreateUpdateMajor;