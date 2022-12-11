import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";
import classGroupServices from "../classGroup/classGroupServices";
import studentServices from "../student/studentServices";

const getAllStudent_ClassGroups = async () => {
    try {
        let dataStudents = await db.Student.findAll({
            where: { isDeleted: 0 },
            attributes: ['id', 'fullName', 'email'],
            include: [
                {
                    model: db.Student_ClassGroup,
                    attributes: ['classGroupId'],
                }
            ],
            nest: true,
            raw: true,
        })

        let dataStudent_ClassGroups = await Promise.all(dataStudents.map(async (student) => {
            let dataClassGroup = await classGroupServices.getClassGroupById(student.Student_ClassGroups.classGroupId);

            let classGroup = dataClassGroup.DT;
            let nameClassGroup = '';
            if (classGroup)
                nameClassGroup = `${classGroup?.SchoolYear?.name}.${classGroup?.Subject?.description}.${classGroup?.RegistrationGroup?.name}`;

            return {
                id: student.id,
                fullName: student.fullName,
                email: student.email,
                classGroupId: classGroup.id ?? '',
                name: nameClassGroup
            };

        }))


        // Dựa vào vòng loop này để improve các vòng loop map có Promise.All
        let data = [];
        dataStudent_ClassGroups.forEach(student_classGroup => {
            // Convert Majors to obj of array
            student_classGroup = { ...student_classGroup, name: [student_classGroup.name], classGroupId: [student_classGroup.classGroupId] }

            let match = data.find(r => r.id === student_classGroup.id);
            if (match) {
                match.name = match.name.concat(student_classGroup.name);
                match.classGroupId = match.classGroupId.concat(student_classGroup.classGroupId);
            } else {
                data.push(student_classGroup);
            }
        });

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get all Student_ClassGroup successful !", data);

        return apiUtils.resFormat(1, "Get all Student_ClassGroup failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStudent_ClassGroupsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Student.findAndCountAll({
            where: { isDeleted: 0 },
            attributes: ['id', 'fullName', 'email'],
            include: [
                {
                    model: db.Student_ClassGroup,
                    attributes: ['classGroupId'],
                }
            ],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        let dataStudent_ClassGroups = await Promise.all(rows.map(async (student) => {
            let dataClassGroup = await classGroupServices.getClassGroupById(student.Student_ClassGroups.classGroupId);

            let classGroup = dataClassGroup.DT;
            let nameClassGroup = '';
            if (classGroup)
                nameClassGroup = `${classGroup?.SchoolYear?.name}.${classGroup?.Subject?.description}.${classGroup?.RegistrationGroup?.name}`;

            return {
                id: student.id,
                fullName: student.fullName,
                email: student.email,
                // classGroupId: classGroup.id ?? '',
                // name: nameClassGroup,
                classGroups: {
                    id: classGroup.id ?? '',
                    name: nameClassGroup
                }
            };

        }))


        // Dựa vào vòng loop này để improve các vòng loop map có Promise.All
        let result = [];
        dataStudent_ClassGroups.forEach(student_classGroup => {
            // Convert Majors to obj of array
            student_classGroup = { ...student_classGroup, classGroups: [student_classGroup.classGroups] }

            let match = result.find(r => r.id === student_classGroup.id);
            if (match) {
                match.classGroups = match.classGroups.concat(student_classGroup.classGroups);
            } else {
                result.push(student_classGroup);
            }
        });

        rows = result;

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            student_classGroups: rows
        }

        if (time)
            await apiUtils.delay(time);

        if (rows.length > 0)
            return apiUtils.resFormat(0, "Get student_classGroups with pagination successful !", data);

        return apiUtils.resFormat(1, "Get student_classGroups with pagination failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

// const getStudent_ClassGroupByTeacherId = async (teacherId) => {
//     try {
//         let data = await db.Student_ClassGroup.findAll({
//             where: {
//                 [Op.and]: [
//                     { isDeleted: 0 },
//                     { teacherId },
//                 ]
//             },
//             attributes: ['id', 'name', 'description', 'majorId'],
//             raw: true,
//         })

//         if (data.length > 0)
//             return apiUtils.resFormat(0, "Get Student_ClassGroup by teacherId successful !", data);

//         return apiUtils.resFormat(1, "Get Student_ClassGroup by teacherId failed !", data);
//     } catch (error) {
//         console.log(error);
//         return apiUtils.resFormat();
//     }
// }

const getStudent_ClassGroupByStudentIdAndClassGroupId = async (studentId, classGroupId) => {
    try {
        let data = await db.Student_ClassGroup.findOne({
            where: {
                [Op.and]: [
                    { studentId },
                    { classGroupId },
                ]
            },
            attributes: [
                'id', 'studentId', 'classGroupId',
                'numberOfAbsences', 'numberOfLies', 'numberOfTimesBeingLate'
            ],
            raw: true,
        })

        if (data)
            return apiUtils.resFormat(0, "Get Student_ClassGroup by studentId and classGroupId successful !", data);

        return apiUtils.resFormat(1, "Get Student_ClassGroup by studentId and classGroupId failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createANewStudent_ClassGroup = async (student_classGroup) => {
    try {
        await db.Student_ClassGroup.create({
            name: student_classGroup.name,
            description: student_classGroup.description,
            isDeleted: 0,
            student_classGroupId: student_classGroup.student_classGroupId
        })

        return apiUtils.resFormat(0, "Create a new student_classGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createManyStudent_ClassGroups = async (dataStudent_ClassGroups) => {
    try {
        let totalStudent_ClassGroups = 0;
        await Promise.all(dataStudent_ClassGroups.map(async (student_classGroup) => {
            let classGroupIds = student_classGroup.classGroupIds;

            let listStudent_ClassGroup = await classGroupIds.map((classGroupId) => {
                totalStudent_ClassGroups++;
                return {
                    studentId: student_classGroup.studentId,
                    classGroupId
                }
            })

            await db.Student_ClassGroup.bulkCreate(listStudent_ClassGroup);
        }))

        return apiUtils.resFormat(0, `Create ${totalStudent_ClassGroups} student_classGroups successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateAStudent_ClassGroup = async (student_classGroupUpdate) => {
    try {
        let listStudent_ClassGroup = await student_classGroupUpdate.classGroupIds.map((classGroupId) => {
            return {
                studentId: student_classGroupUpdate.studentId,
                classGroupId
            }
        })

        await db.Student_ClassGroup.destroy({
            where: {
                studentId: student_classGroupUpdate.studentId
            }
        })

        await db.Student_ClassGroup.bulkCreate(listStudent_ClassGroup);

        return apiUtils.resFormat(0, "Update a student_classGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const deleteAStudent_ClassGroup = async (student_classGroup) => {
    try {
        if (student_classGroup.isDeleted) {
            await db.Student_ClassGroup.update({ isDeleted: +student_classGroup.isDeleted }, {
                where: {
                    id: student_classGroup.id
                }
            })

            return apiUtils.resFormat(0, `${+student_classGroup.isDeleted === 0 ? 'Open' : 'Close'} a student_classGroup successful !`);
        }

        // Delete khỏi database
        await db.Student_ClassGroup.destroy({
            where: {
                studentId: student_classGroup.studentId
            }
        })

        return apiUtils.resFormat(0, "Delete a student_classGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStudent_classGroupVirtualByClassGroupId = async (classGroupId) => {
    try {

        let dataVirtual = await db.Student_ClassGroupVirtual.findAll({
            where: { classGroupId },
            attributes: ['studentId', 'classGroupId', 'timeline'],
            raw: true,
            nest: true
        })


        let listVirtual = [];
        dataVirtual.forEach(item => {
            item = {
                ...item,
                timeline: [item.timeline],
            }

            let match = listVirtual.find(r => r.studentId === item.studentId);
            if (match) {
                match.timeline = match.timeline.concat(item.timeline);
            } else {
                listVirtual.push(item);
            }
        });


        if (listVirtual.length > 0)
            return apiUtils.resFormat(0, `Get Student_ClassGroupVirtual by classGroupId successful !`, listVirtual);

        return apiUtils.resFormat(1, `Get Student_ClassGroupVirtual by classGroupId failed !`, listVirtual);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const countOrLimitStudent_classGroupVirtualByClassGroupId = async (timeline, classGroupId, limit) => {
    try {
        let amountStudents = await db.Student_ClassGroupVirtual.count({
            where: {
                [Op.and]: [
                    { classGroupId },
                    { timeline },
                ]
            },
        })


        if (limit) {
            if (amountStudents === limit) {
                return apiUtils.resFormat(1, `Student_ClassGroupVirtual by classGroupId is full !`);
            }

            return apiUtils.resFormat(0, `Student_ClassGroupVirtual by classGroupId isn't full !`, amountStudents);
        }

        if (amountStudents)
            return apiUtils.resFormat(0, `Count Student_ClassGroupVirtual by classGroupId successful !`, amountStudents);

        return apiUtils.resFormat(1, `Count Student_ClassGroupVirtual by classGroupId failed !`);

    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateNumberOf = async (status, studentId, classGroupId) => {
    try {
        let column;
        if (status === 'ABSENT') {
            column = 'numberOfAbsences';
        } else if (status === 'LATE') {
            column = 'numberOfTimesBeingLate';
        } else if (status === 'LIE') {
            column = 'numberOfLies';
        } else {
            return apiUtils.resFormat();
        }

        let dataStudent_classGroup = await getStudent_ClassGroupByStudentIdAndClassGroupId(studentId, classGroupId);
        let numberOfBefore;

        if (dataStudent_classGroup.EC === 0) {
            numberOfBefore = +dataStudent_classGroup.DT[column];
            numberOfBefore++;
        }

        await db.Student_ClassGroup.update({
            [column]: numberOfBefore
        }, {
            where: {
                [Op.and]: [
                    { studentId },
                    { classGroupId },
                ]
            }
        })

        return apiUtils.resFormat(0, "Update a student_classGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getStudent_ClassGroupByStudentIdAndClassGroupId,
    getStudent_ClassGroupsWithPagination, getAllStudent_ClassGroups,
    createANewStudent_ClassGroup, createManyStudent_ClassGroups,
    updateAStudent_ClassGroup, deleteAStudent_ClassGroup,
    getStudent_classGroupVirtualByClassGroupId, countOrLimitStudent_classGroupVirtualByClassGroupId,
    updateNumberOf

}