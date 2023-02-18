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


const CreateUpdateClassGroup = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [classGroupId, setClassGroupId] = useState('');
    const [listSubjects, setListSubjects] = useState([]);
    const [listRegistrationGroups, setListRegistrationGroups] = useState([]);
    const [listTeachers, setListTeachers] = useState([]);
    const [listSchoolYears, setListSchoolYears] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [teacherId, setTeacherId] = useState('');

    const initClassGroups = [
        {
            id: uuidv4(),
            teacherId: '',
            schoolYearId: '',
            subjectId: '',
            registrationGroupIds: []
        },
    ];

    const [classGroups, setClassGroups] = useState(initClassGroups)

    const handleClearForm = () => {
        setName('');
        setDescription('');
        setClassGroupId('');
    }

    const clearCheckbox = () => {
        [...document.querySelectorAll('[type="checkbox"]')].forEach((item) => {
            item.disabled = false;
            item.checked = false;
        });
    }

    const handleSubmit = async () => {
        try {
            // let isValid = validationUtils.validate('createUpdateClassGroup');
            if (true) {
                let registrationGroupsCheckbox = document.querySelectorAll('[type="checkbox"]');
                let classGroupsClone = _.cloneDeep(classGroups);

                let listClassGroups = classGroupsClone.map(classGroup => {
                    for (const item of registrationGroupsCheckbox) {
                        if (classGroup.id === item.id && item.checked) {
                            classGroup.registrationGroupIds.push(item.getAttribute('data-value'));
                        }
                    }

                    return {
                        ...classGroup,
                    }
                })

                let data = await axios.post('api/classGroups', [...listClassGroups]);
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchClassGroups();
                    // handleClearForm();
                    setClassGroups(initClassGroups);
                    clearCheckbox();
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
            // let isValid = validationUtils.validate('createUpdateClassGroup');
            if (true) {
                let data = await axios.patch('api/classGroups', {
                    id: props.classGroupUpdate.id,
                    teacherId,
                });
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchClassGroups();
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

    const getAllSubjects = async () => {
        try {
            let data = await axios.get('api/subjects');
            if (data && data.EC === 0) {
                setListSubjects(data.DT)
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error)
        }
    }

    const getAllRegistrationGroups = async () => {
        try {
            let data = await axios.get('api/registrationGroups');
            if (data && data.EC === 0) {
                setListRegistrationGroups(data.DT)
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error)
        }
    }

    const getAllTeachers = async () => {
        try {
            let data = await axios.get('api/teachers');
            if (data && data.EC === 0) {
                setListTeachers(data.DT)
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error)
        }
    }

    const getAllSchoolYears = async () => {
        try {
            let data = await axios.get('api/schoolYears');
            if (data && data.EC === 0) {
                setListSchoolYears(data.DT)
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error)
        }
    }

    const handleAddRemoveClassGroup = (type, classGroupId) => {
        if (type === 'ADD') {
            const newClassGroup = {
                id: uuidv4(),
                teacherId: '',
                schoolYearId: '',
                subjectId: '',
                registrationGroupIds: []
            }

            setClassGroups([...classGroups, newClassGroup])
        }

        if (type === 'REMOVE') {
            let cloneClassGroups = _.cloneDeep(classGroups);

            cloneClassGroups = cloneClassGroups.filter(classGroup => classGroup.id !== classGroupId)

            setClassGroups(cloneClassGroups);
        }
    }

    // const handleAddRemoveClassGroup = (type, classGroupId, RegistrationGroupIdId) => {
    //     if (type === 'ADD') {
    //         let cloneClassGroups = _.cloneDeep(classGroups);

    //         let classGroupIndex = cloneClassGroups.findIndex(classGroup => classGroup.id === classGroupId)

    //         if (classGroupIndex > -1) {
    //             const newClassGroup = {
    //                 id: uuidv4(),
    //                 name: '',
    //                 description: '',
    //             }
    //             cloneClassGroups[classGroupIndex].registrationGroupIds.push(newClassGroup);
    //             setClassGroups(cloneClassGroups);
    //         }
    //     }

    //     if (type === 'REMOVE') {
    //         let cloneClassGroups = _.cloneDeep(classGroups);

    //         let classGroupIndex = cloneClassGroups.findIndex(classGroup => classGroup.id === classGroupId)

    //         if (classGroupIndex > -1) {
    //             cloneClassGroups[classGroupIndex].registrationGroupIds = cloneClassGroups[classGroupIndex].registrationGroupIds.filter(RegistrationGroupId => RegistrationGroupId.id !== RegistrationGroupIdId)
    //             setClassGroups(cloneClassGroups);
    //         }
    //     }
    // }



    const handleOnChange = (type, classGroupId, registrationGroupId, field, value) => {
        if (type === 'SUBJECT') {
            let cloneClassGroups = _.cloneDeep(classGroups);
            let classGroupIndex = cloneClassGroups.findIndex(classGroup => classGroup.id === classGroupId)

            if (classGroupIndex > -1) {
                let registrationGroupIdsExist = props.listClassGroups.map((item) => {
                    return {
                        subjectId: item.Subject.id,
                        registrationGroupId: item.RegistrationGroup.id,
                    }
                })


                let classGroupsExist = [];
                registrationGroupIdsExist.forEach(registrationGroupId => {
                    registrationGroupId = {
                        ...registrationGroupId,
                        registrationGroupId: [registrationGroupId.registrationGroupId],
                        id: classGroupId,
                    }

                    let match = classGroupsExist.find(r => r.subjectId === registrationGroupId.subjectId);
                    if (match) {
                        match.registrationGroupId = match.registrationGroupId.concat(registrationGroupId.registrationGroupId);
                    } else {
                        classGroupsExist.push(registrationGroupId);
                    }
                });


                let regisCheckbox = document.querySelectorAll(`[name="registrationGroups-${classGroupId}"]`);
                for (const item of regisCheckbox) {
                    item.disabled = false;
                    for (const classGroup of classGroupsExist) {
                        if (classGroup.subjectId === +value) {
                            if (classGroup.registrationGroupId.includes(+item.getAttribute('data-value')))
                                item.disabled = true;
                        }
                    }
                }

                cloneClassGroups[classGroupIndex].subjectId = value;
                setClassGroups(cloneClassGroups);
            }
        }

        if (type === 'SCHOOLYEAR') {
            let cloneClassGroups = _.cloneDeep(classGroups);

            let classGroupIndex = cloneClassGroups.findIndex(classGroup => classGroup.id === classGroupId)

            if (classGroupIndex > -1) {
                cloneClassGroups[classGroupIndex].schoolYearId = value;
                setClassGroups(cloneClassGroups);
            }
        }

        if (type === 'TEACHER') {
            let cloneClassGroups = _.cloneDeep(classGroups);

            let classGroupIndex = cloneClassGroups.findIndex(classGroup => classGroup.id === classGroupId)

            if (classGroupIndex > -1) {
                cloneClassGroups[classGroupIndex].teacherId = value;
                setClassGroups(cloneClassGroups);
            }
        }


    }

    const handleCancel = () => {
        setClassGroups(initClassGroups);
        props.setClassGroupUpdate({});
        props.setIsUpdate(false);
    }


    const handleEnter = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }


    useEffect(() => {
        getAllSubjects();
        getAllRegistrationGroups();
        getAllTeachers();
        getAllSchoolYears();
    }, [])

    useEffect(() => {
        setTeacherId(props.classGroupUpdate?.Teacher?.id)
        setClassGroupId(props.classGroupUpdate?.id);
    }, [props.classGroupUpdate])

    return (
        <>
            {props.isUpdate ?
                <h3>Update a ClassGroup</h3>
                :
                <h3>Add new ClassGroup</h3>
            }

            <Form id='createUpdateClassGroup' onKeyUp={(event) => handleEnter(event)}>
                {props.isUpdate ?
                    <>
                        <Form.Select
                            className="mb-3 w-100"
                            aria-label="Default select example"
                            name='classGroup'
                            onChange={(event) => setClassGroupId(event.target.value)}
                            value={classGroupId}
                        >
                            <option value={''}>ClassGroup</option>
                            {props.listClassGroups.length > 0
                                && props.listClassGroups.map((classGroupItem, indexItem) => {
                                    return (
                                        <option
                                            key={`classGroup-${indexItem}`}
                                            value={classGroupItem.id}
                                        >{`${classGroupItem.SchoolYear.name}.${classGroupItem.Subject.description}.${classGroupItem.RegistrationGroup.name}`}</option>
                                    )
                                })
                            }
                        </Form.Select>

                        <Form.Select
                            className="mb-3 w-100"
                            aria-label="Default select example"
                            name='teacher'
                            onChange={(event) => setTeacherId(event.target.value)}
                            value={teacherId}
                        >
                            <option value={''}>Teacher</option>
                            {listTeachers.length > 0
                                && listTeachers.map((teacherItem, indexItem) => {
                                    return (
                                        <option
                                            key={`teacher-${indexItem}`}
                                            value={teacherItem.id}
                                        >{teacherItem.fullName}</option>
                                    )
                                })
                            }
                        </Form.Select>

                    </>
                    :
                    <>
                        {classGroups.length > 0
                            && classGroups.map((classGroup, index) => {
                                return (
                                    <span key={`classGroup-${index + 1}`}>
                                        <span className='d-flex gap-2'>
                                            <Form.Select
                                                className="mb-3 w-75"
                                                aria-label="Default select example"
                                                name='classGroup'
                                                onChange={(event) => handleOnChange('TEACHER', classGroup.id, '', '', event.target.value)}
                                                value={classGroup.teacherId}
                                            >
                                                <option value={''}>Teacher's {index + 1}</option>
                                                {listTeachers.length > 0
                                                    && listTeachers.map((teacherItem, indexItem) => {
                                                        return (
                                                            <option
                                                                key={`teacher-${indexItem}`}
                                                                value={teacherItem.id}
                                                            >{teacherItem.fullName}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Select>


                                            <Form.Select
                                                className="mb-3 w-25"
                                                aria-label="Default select example"
                                                name='classGroup'
                                                onChange={(event) => handleOnChange('SCHOOLYEAR', classGroup.id, '', '', event.target.value)}
                                                value={classGroup.schoolYearId}
                                            >
                                                <option value={''}>SchoolYear's {index + 1}</option>
                                                {listSchoolYears.length > 0
                                                    && listSchoolYears.map((schoolYearItem, indexItem) => {
                                                        return (
                                                            <option
                                                                key={`schoolYear-${indexItem}`}
                                                                value={schoolYearItem.id}
                                                            >{schoolYearItem.description}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Select>

                                            <span onClick={() => handleAddRemoveClassGroup('ADD')} className='mt-1 h-100' role="button" >
                                                <FcPlus size={'24px'} />
                                            </span>

                                            {classGroups.length > 1 &&
                                                <span onClick={() => handleAddRemoveClassGroup('REMOVE', classGroup.id)} className='text-danger h-100' role="button">
                                                    <MdDeleteForever size={'32px'} />
                                                </span>
                                            }
                                        </span>

                                        <Form.Select
                                            className="mb-3"
                                            aria-label="Default select example"
                                            name='classGroup'
                                            onChange={(event) => handleOnChange('SUBJECT', classGroup.id, '', '', event.target.value)}
                                            value={classGroup.subjectId}
                                        >
                                            <option value={''}>Subject's {index + 1}</option>
                                            {listSubjects.length > 0
                                                && listSubjects.map((subjectItem, indexItem) => {
                                                    return (
                                                        <option
                                                            key={`subject-${indexItem}`}
                                                            value={subjectItem.id}

                                                        >{subjectItem.description}</option>
                                                    )
                                                })
                                            }
                                        </Form.Select>



                                        <div className={`border border-1 mb-3 w-100 container ${props?.isUpdate || true ? '' : 'd-none'}`}>
                                            <p className='text-center pt-2'>
                                                <span className='border border-2 border-info p-1'>Registration Groups</span>
                                            </p>
                                            <div className='row'>
                                                {listRegistrationGroups.length > 0
                                                    && listRegistrationGroups.map((registrationGroupItem, indexItem) => {
                                                        return (
                                                            <div key={`registrationGroup-${indexItem}`} className='col-6'>
                                                                <Form.Check
                                                                    data-value={registrationGroupItem.id}
                                                                    className='mb-3'
                                                                    type={'checkbox'}
                                                                    name={`registrationGroups-${classGroup.id}`}
                                                                    id={classGroup.id}
                                                                    label={registrationGroupItem.description}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>

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


export default CreateUpdateClassGroup;