import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from '../../../../configs/axios';
import { toast } from 'react-toastify';
import validationUtils from '../../../../utils/validationUtils';
import { FcPlus } from 'react-icons/fc';
import { MdDeleteForever } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';


const CreateUpdateStudent_ClassGroup = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [student_classGroupId, setStudent_ClassGroupId] = useState('');
    const [listClassGroups, setListClassGroups] = useState([]);
    const [listStudents, setListStudents] = useState([]);
    const [listSchoolYears, setListSchoolYears] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [studentId, setStudentId] = useState('');

    const initStudent_ClassGroups = [
        {
            id: uuidv4(),
            studentId: '',
            classGroupIds: []
        },
    ];

    const [student_classGroups, setStudent_ClassGroups] = useState(initStudent_ClassGroups)

    const handleClearForm = () => {
        setName('');
        setDescription('');
        setStudent_ClassGroupId('');
    }

    const clearCheckbox = () => {
        [...document.querySelectorAll('[type="checkbox"]')].forEach((item) => {
            item.disabled = false;
            item.checked = false;
        });
    }

    const handleSubmit = async () => {
        try {
            // let isValid = validationUtils.validate('createUpdateStudent_ClassGroup');
            if (true) {
                let classGroupsCheckbox = document.querySelectorAll('[type="checkbox"]');
                let student_classGroupsClone = _.cloneDeep(student_classGroups);

                let listStudent_ClassGroups = student_classGroupsClone.map(student_classGroup => {
                    for (const item of classGroupsCheckbox) {
                        if (student_classGroup.id === item.id && item.checked) {
                            student_classGroup.classGroupIds.push(item.getAttribute('data-value'));
                        }
                    }

                    return {
                        ...student_classGroup,
                    }
                })


                let data = await axios.post('api/student_classGroups', [...listStudent_ClassGroups]);
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchStudent_ClassGroups();
                    // handleClearForm();
                    setStudent_ClassGroups(initStudent_ClassGroups);
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
            // let isValid = validationUtils.validate('createUpdateStudent_ClassGroup');

            if (true) {
                let classGroupsCheckbox = document.querySelectorAll('[name="classGroupsUpdate"]');

                let classGroupIdsUpdate = []
                for (const item of classGroupsCheckbox) {
                    if (item.checked)
                        classGroupIdsUpdate.push(+item.getAttribute('data-value'))
                }


                let data = await axios.patch('api/student_classGroups', {
                    studentId: props.student_classGroupUpdate.id,
                    classGroupIds: classGroupIdsUpdate,
                });
                if (data && data.EC === 0) {
                    setIsWaiting(false);
                    props.fetchStudent_ClassGroups();
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

    const getAllClassGroups = async () => {
        try {
            let data = await axios.get('api/classGroups');

            if (data && data.EC === 0) {
                setListClassGroups(data.DT)
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error)
        }
    }

    // Có bug: Khi add new student thì chưa fetch lại list students 
    // improve bằng cách để redux lắng nghe khi có sự thay đổi
    const getAllStudents = async () => {
        try {
            let data = await axios.get('api/students');
            if (data && data.EC === 0) {
                setListStudents(data.DT)
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

    const handleAddRemoveStudent_ClassGroup = (type, student_classGroupId) => {
        if (type === 'ADD') {
            const newStudent_ClassGroup = {
                id: uuidv4(),
                studentId: '',
                classGroupIds: []
            }

            setStudent_ClassGroups([...student_classGroups, newStudent_ClassGroup])
        }

        if (type === 'REMOVE') {
            let cloneStudent_ClassGroups = _.cloneDeep(student_classGroups);

            cloneStudent_ClassGroups = cloneStudent_ClassGroups.filter(student_classGroup => student_classGroup.id !== student_classGroupId)

            setStudent_ClassGroups(cloneStudent_ClassGroups);
        }
    }

    const handleOnChange = (type, student_classGroupId, classGroupId, field, value) => {
        if (type === 'STUDENT') {
            let cloneStudent_ClassGroups = _.cloneDeep(student_classGroups);
            let student_classGroupIndex = cloneStudent_ClassGroups.findIndex(student_classGroup => student_classGroup.id === student_classGroupId)

            if (student_classGroupIndex > -1) {

                let classGroupsExist = props.listStudent_ClassGroups.map(item => {
                    let classGroupIds = item.classGroups.map(classGroup => {
                        return classGroup.id;
                    })

                    return {
                        studentId: item.id,
                        classGroupIds
                    }
                })


                let regisCheckbox = document.querySelectorAll(`[name="classGroups-${student_classGroupId}"]`);
                for (const item of regisCheckbox) {
                    item.disabled = false;
                    for (const classGroup of classGroupsExist) {
                        if (classGroup.studentId === +value) {
                            if (classGroup.classGroupIds.includes(+item.getAttribute('data-value')))
                                item.disabled = true;
                        }
                    }
                }

                cloneStudent_ClassGroups[student_classGroupIndex].studentId = value;
                setStudent_ClassGroups(cloneStudent_ClassGroups);
            }
        }
    }

    const handleCancel = () => {
        setStudent_ClassGroups(initStudent_ClassGroups);
        props.setStudent_ClassGroupUpdate({});
        props.setIsUpdate(false);
    }


    const handleEnter = (event) => {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }

    const checkedClassGroupsUpdate = () => {
        if (props?.student_classGroupUpdate?.classGroups) {
            let classGroupsCheckbox = document.querySelectorAll('[name="classGroupsUpdate"]');
            for (const item of classGroupsCheckbox) {
                item.checked = false;
                for (const classGroup of props?.student_classGroupUpdate?.classGroups) {
                    if (+item.getAttribute('data-value') === classGroup.id) {
                        item.checked = true;
                    }
                }
            }
        }

    }


    useEffect(() => {
        getAllClassGroups();
        getAllStudents();
        getAllSchoolYears();
    }, [])

    useEffect(() => {
        setStudentId(props.student_classGroupUpdate?.id)
        checkedClassGroupsUpdate();
    }, [props.student_classGroupUpdate])

    return (
        <>
            {props.isUpdate ?
                <h3>Update a Student_ClassGroup</h3>
                :
                <h3>Add new Student_ClassGroup</h3>
            }

            <Form id='createUpdateStudent_ClassGroup' onKeyUp={(event) => handleEnter(event)}>
                <div className={`border border-1 mb-3 w-100 container ${props?.isUpdate ? '' : 'd-none'}`}>
                    <p className='text-center pt-2'>
                        <span className='border border-2 border-info p-1'>ClassGroups</span>
                    </p>

                    <div className='row '>
                        {listClassGroups.length > 0
                            && listClassGroups.map((classGroupItem, indexItem) => {
                                return (
                                    <div key={`classGroup-${indexItem}`} className='col-12'>
                                        <Form.Check
                                            // onChange={(event) => handleOnChange('MAJOR', classGroupItem.id, '', '', event.target.checked)}
                                            data-value={classGroupItem.id}
                                            className='mb-3'
                                            type={'checkbox'}
                                            name={`classGroupsUpdate`}
                                            // id={classGroupItem.id}
                                            // checked={}
                                            label={`${classGroupItem.SchoolYear.name}.${classGroupItem.Subject.description}.${classGroupItem.RegistrationGroup.name}`}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                {props.isUpdate ?
                    <>
                        <Form.Select
                            className="mb-3 w-100"
                            aria-label="Default select example"
                            name='student'
                            onChange={(event) => setStudentId(event.target.value)}
                            value={studentId}
                        >
                            <option value={''}>Student</option>
                            {listStudents.length > 0
                                && listStudents.map((studentItem, indexItem) => {
                                    return (
                                        <option
                                            key={`student-${indexItem}`}
                                            value={studentItem.id}
                                        >{studentItem.fullName}</option>
                                    )
                                })
                            }
                        </Form.Select>
                    </>
                    :
                    <>
                        {student_classGroups.length > 0
                            && student_classGroups.map((student_classGroup, index) => {
                                return (
                                    <span key={`student_classGroup-${index + 1}`}>
                                        <span className='d-flex gap-2'>
                                            <Form.Select
                                                className="mb-3 w-100"
                                                aria-label="Default select example"
                                                name='student_classGroup'
                                                onChange={(event) => handleOnChange('STUDENT', student_classGroup.id, '', '', event.target.value)}
                                                value={student_classGroup.studentId}
                                            >
                                                <option value={''}>Student's {index + 1}</option>
                                                {listStudents.length > 0
                                                    && listStudents.map((studentItem, indexItem) => {
                                                        return (
                                                            <option
                                                                key={`student-${indexItem}`}
                                                                value={studentItem.id}
                                                            >{studentItem.fullName}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Select>


                                            <span onClick={() => handleAddRemoveStudent_ClassGroup('ADD')} className='mt-1 h-100' role="button" >
                                                <FcPlus size={'24px'} />
                                            </span>

                                            {student_classGroups.length > 1 &&
                                                <span onClick={() => handleAddRemoveStudent_ClassGroup('REMOVE', student_classGroup.id)} className='text-danger h-100' role="button">
                                                    <MdDeleteForever size={'32px'} />
                                                </span>
                                            }
                                        </span>


                                        <div className={`border border-1 mb-3 w-100 container ${props?.isUpdate || true ? '' : 'd-none'}`}>
                                            <p className='text-center pt-2'>
                                                <span className='border border-2 border-info p-1'>Class Groups</span>
                                            </p>
                                            <div className='row'>
                                                {listClassGroups.length > 0
                                                    && listClassGroups.map((classGroupItem, indexItem) => {
                                                        return (
                                                            <div key={`classGroup-${indexItem}`} className='col-12'>
                                                                <Form.Check
                                                                    data-value={classGroupItem.id}
                                                                    className='mb-3'
                                                                    type={'checkbox'}
                                                                    name={`classGroups-${student_classGroup.id}`}
                                                                    id={student_classGroup.id}
                                                                    label={`${classGroupItem.SchoolYear.name}.${classGroupItem.Subject.description}.${classGroupItem.RegistrationGroup.name}`}
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


export default CreateUpdateStudent_ClassGroup;