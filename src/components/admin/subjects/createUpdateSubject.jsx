import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../configs/axios';
import { toast } from 'react-toastify';
import validationUtils from '../../../utils/validationUtils';
import '../../../assets/scss/admin/subjects/createUpdateSubject.scss';
import { FcPlus } from 'react-icons/fc';
import { MdDeleteForever } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';


const CreateUpdateSubject = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [majorId, setMajorId] = useState('');
    const [listMajors, setListMajors] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);

    const initMajors = [
        {
            id: uuidv4(),
            majorIds: [],
            subjects: [
                {
                    id: uuidv4(),
                    name: '',
                    description: '',
                }
            ]
        },
    ];

    const [majors, setMajors] = useState(initMajors)

    const handleClearForm = () => {
        setName('');
        setDescription('');
        setMajorId('');
    }

    const clearCheckbox = () => {
        [...document.querySelectorAll('[type="checkbox"]')].forEach((item) => {
            if (item.checked) {
                item.checked = false;
            }
        });
    }

    const handleSubmit = async () => {
        try {
            // let isValid = validationUtils.validate('createUpdateSubject');
            if (true) {
                let majorsCheckbox = document.querySelectorAll('[name="majors"]');
                let majorsClone = _.cloneDeep(majors);

                let listSubjects = majorsClone.map(major => {
                    for (const item of majorsCheckbox) {
                        if (major.id === item.id && item.checked) {
                            major.majorIds.push(+item.getAttribute('data-value'));
                        }
                    }

                    let subjects = major.subjects.map((subject) => {
                        return {
                            name: subject.name,
                            description: subject.description,
                        }
                    })

                    return {
                        subjects,
                        majorIds: major.majorIds
                    }
                })

                let data = await axios.post('api/subjects', [...listSubjects]);

                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchSubjects();
                    // handleClearForm();
                    clearCheckbox();
                    setMajors(initMajors);
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
            // let isValid = validationUtils.validate('createUpdateSubject');

            if (true) {
                let majorsCheckbox = document.querySelectorAll('[name="majorsSubjectUpdate"]');

                let majorIdsUpdate = []
                for (const item of majorsCheckbox) {
                    if (item.checked)
                        majorIdsUpdate.push(+item.getAttribute('data-value'))
                }

                let data = await axios.patch('api/subjects', {
                    id: props.subjectUpdate.id,
                    name,
                    description,
                    majorIds: majorIdsUpdate
                });
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchSubjects();
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

    const getAllMajors = async () => {
        try {
            let data = await axios.get('api/majors');
            if (data && data.EC === 0) {
                setListMajors(data.DT)
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error)
        }
    }

    const handleAddRemoveMajor = (type, majorId) => {
        if (type === 'ADD') {
            const newMajor = {
                id: uuidv4(),
                majorIds: [],
                subjects: [
                    {
                        id: uuidv4(),
                        name: '',
                        description: '',
                    }
                ]
            }

            setMajors([...majors, newMajor])
        }

        if (type === 'REMOVE') {
            let cloneMajors = _.cloneDeep(majors);

            cloneMajors = cloneMajors.filter(major => major.id !== majorId)

            setMajors(cloneMajors);
        }
    }

    const handleAddRemoveSubject = (type, majorId, subjectId) => {
        if (type === 'ADD') {
            let cloneMajors = _.cloneDeep(majors);

            let majorIndex = cloneMajors.findIndex(major => major.id === majorId)

            if (majorIndex > -1) {
                const newSubject = {
                    id: uuidv4(),
                    name: '',
                    description: '',
                }
                cloneMajors[majorIndex].subjects.push(newSubject);
                setMajors(cloneMajors);
            }
        }

        if (type === 'REMOVE') {
            let cloneMajors = _.cloneDeep(majors);

            let majorIndex = cloneMajors.findIndex(major => major.id === majorId)

            if (majorIndex > -1) {
                cloneMajors[majorIndex].subjects = cloneMajors[majorIndex].subjects.filter(subject => subject.id !== subjectId)
                setMajors(cloneMajors);
            }
        }
    }





    const handleOnChange = (type, majorId, subjectId, field, value) => {
        // if (type === 'MAJOR') {
        //     let cloneMajors = _.cloneDeep(majors);

        //     let majorIndex = cloneMajors.findIndex(major => major.id === majorId)

        //     if (majorIndex > -1) {
        //         cloneMajors[majorIndex].majorId = value;
        //         setMajors(cloneMajors);
        //     }
        // }

        if (type === 'SUBJECT') {
            let cloneMajors = _.cloneDeep(majors);

            let majorIndex = cloneMajors.findIndex(major => major.id === majorId)

            if (majorIndex > -1) {
                let subjectIndex = cloneMajors[majorIndex].subjects.findIndex(subject => subject.id === subjectId)

                if (subjectIndex > -1) {
                    cloneMajors[majorIndex].subjects[subjectIndex][field] = value;
                    setMajors(cloneMajors);
                }

            }
        }
    }

    const handleCancel = () => {
        setMajors(initMajors);
        props.setSubjectUpdate({});
        props.setIsUpdate(false);
    }


    const handleEnter = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }

    const checkedMajorsUpdate = () => {
        if (props?.subjectUpdate?.Majors) {
            let majorsCheckbox = document.querySelectorAll('[name="majorsSubjectUpdate"]');
            for (const item of majorsCheckbox) {
                item.checked = false;
                for (const major of props?.subjectUpdate?.Majors) {
                    if (+item.getAttribute('data-value') === major.id) {
                        item.checked = true;
                    }
                }
            }
        }

    }


    useEffect(() => {
        getAllMajors();
    }, [])

    useEffect(() => {
        setName(props.subjectUpdate?.name);
        setDescription(props.subjectUpdate?.description);
        clearCheckbox();
        checkedMajorsUpdate();
    }, [props.subjectUpdate])





    return (
        <>
            {props.isUpdate ?
                <h3>Update a subject</h3>
                :
                <h3>Add new subject</h3>
            }

            <Form id='createUpdateSubject' onKeyUp={(event) => handleEnter(event)}>
                {/* useEffect của props.subjectUpdate ko render kịp nếu đặt 
                div này trong props.isUpdate, vì vậy phải cho render div này
                trước khi component props.isUpdate được render
                */}
                <div className={`border border-1 mb-3 w-100 container ${props?.isUpdate ? '' : 'd-none'}`}>
                    <p className='text-center pt-2'>
                        <span className='border border-2 border-info p-1'>Majors</span>
                    </p>

                    <div className='row '>
                        {listMajors.length > 0
                            && listMajors.map((majorItem, indexItem) => {
                                return (
                                    <div key={`major-${indexItem}`} className='col-6'>
                                        <Form.Check
                                            // onChange={(event) => handleOnChange('MAJOR', majorItem.id, '', '', event.target.checked)}
                                            data-value={majorItem.id}
                                            className='mb-3'
                                            type={'checkbox'}
                                            name={`majorsSubjectUpdate`}
                                            // id={majorItem.id}
                                            // checked={}
                                            label={majorItem.description}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                {props.isUpdate ?
                    <>
                        {/* <div className='border border-1 mb-3 w-100 container'>
                            <p className='text-center pt-2'>
                                <span className='border border-2 border-info p-1'>Majors</span>
                            </p>

                            <div className='row '>
                                {listMajors.length > 0
                                    && listMajors.map((majorItem, indexItem) => {
                                        return (
                                            <div key={`major-${indexItem}`} className='col-6'>
                                                <Form.Check
                                                    // onChange={(event) => handleOnChange('MAJOR', majorItem.id, '', '', event.target.checked)}
                                                    data-value={majorItem.id}
                                                    className='mb-3'
                                                    type={'checkbox'}
                                                    name={`majorsSubjectUpdate`}
                                                    // id={major.id}
                                                    // checked={}
                                                    label={majorItem.description}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div> */}
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
                        {majors.length > 0
                            && majors.map((major, index) => {
                                return (
                                    <span key={`major-${index + 1}`}>
                                        <div className='border border-1 mb-3 w-100 container'>
                                            <p className='text-center pt-2'>
                                                <span className='border border-2 border-info p-1'>Majors</span>
                                                <span onClick={() => handleAddRemoveMajor('ADD')} className='ms-1 h-100' role="button" >
                                                    <FcPlus size={'24px'} />
                                                </span>
                                                {majors.length > 1 &&
                                                    <span onClick={() => handleAddRemoveMajor('REMOVE', major.id)} className='text-danger h-100' role="button">
                                                        <MdDeleteForever size={'32px'} />
                                                    </span>
                                                }
                                            </p>

                                            <div className='row '>
                                                {listMajors.length > 0
                                                    && listMajors.map((majorItem, indexItem) => {
                                                        return (
                                                            <div key={`major-${indexItem}`} className='col-6'>
                                                                <Form.Check
                                                                    // onChange={(event) => handleOnChange('MAJOR', majorItem.id, '', '', event.target.checked)}
                                                                    data-value={majorItem.id}
                                                                    className='mb-3'
                                                                    type={'checkbox'}
                                                                    name={`majors`}
                                                                    id={major.id}
                                                                    label={majorItem.description}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>

                                        {major.subjects.length > 0 &&
                                            major.subjects.map((subject, index) => {
                                                return (
                                                    <span key={`subject-${index + 1}`} >
                                                        <span className='d-flex gap-2'>
                                                            <FloatingLabel
                                                                controlId="floatingInput"
                                                                label={`Name's ${index + 1}`}
                                                                className="mb-3 w-75"
                                                            >
                                                                <Form.Control
                                                                    name='name'
                                                                    type="text" placeholder="name@example.com"
                                                                    value={subject.name}
                                                                    onChange={(event) => handleOnChange('SUBJECT', major.id, subject.id, event.target.name, event.target.value)}
                                                                />
                                                            </FloatingLabel>

                                                            <span onClick={() => handleAddRemoveSubject('ADD', major.id)} className='mt-3 h-100' role="button" >
                                                                <FcPlus size={'24px'} />
                                                            </span>
                                                            {major.subjects.length > 1 &&
                                                                <span onClick={() => handleAddRemoveSubject('REMOVE', major.id, subject.id)} className='text-danger mt-2 pt-1 h-100' role="button">
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
                                                                value={subject.description}
                                                                onChange={(event) => handleOnChange('SUBJECT', major.id, subject.id, event.target.name, event.target.value)}
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


export default CreateUpdateSubject;