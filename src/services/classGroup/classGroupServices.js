import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import classGroupCodeUtils from "../../utils/classGroupCodeUtils";
import specialStudentsServices from "../specialStudents/specialStudentsServices";
import { Op } from "sequelize";

const getAllClassGroups = async () => {
    try {
        let data = await db.ClassGroup.findAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'isClosed'],
            include: [
                {
                    model: db.Subject,
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: db.RegistrationGroup,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: db.Teacher,
                    attributes: ['id', 'fullName', 'isDeleted']
                },
                {
                    model: db.SchoolYear,
                    attributes: ['id', 'name', 'isGraduated']
                },
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, "Get all ClassGroup successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getClassGroupBySubjectId = async (subjectId) => {
    try {
        let data = await db.ClassGroup.findAll({
            where: {
                [Op.and]: [
                    { isClosed: 0 },
                    { subjectId },
                ]
            },
            attributes: ['id', 'name'],
            raw: true,
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get ClassGroup by subjectId successful !", data);

        return apiUtils.resFormat(1, "Get ClassGroup by subjectId failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getClassGroupByTeacherId = async (teacherId) => {
    try {
        let data = await db.ClassGroup.findAll({
            where: {
                [Op.and]: [
                    { isClosed: 0 },
                    { teacherId },
                ]
            },
            include: [
                {
                    model: db.Subject,
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: db.RegistrationGroup,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: db.SchoolYear,
                    attributes: ['id', 'name', 'description', 'isGraduated']
                },
            ],
            attributes: [
                'id', 'showCode', 'timeline', 'isActive',
                'isClosed'
            ],
            raw: true,
            nest: true
        })


        if (data.length > 0)
            return apiUtils.resFormat(0, "Get ClassGroup by teacherId successful !", data);

        return apiUtils.resFormat(1, "Get ClassGroup by teacherId failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getClassGroupById = async (id) => {
    try {
        let data = await db.ClassGroup.findOne({
            where: {
                [Op.and]: [
                    { isClosed: 0 },
                    { id },
                ]
            },
            attributes: ['id', 'isClosed'],
            include: [
                {
                    model: db.Subject,
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: db.RegistrationGroup,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: db.Teacher,
                    attributes: ['id', 'fullName', 'isDeleted']
                },
                {
                    model: db.SchoolYear,
                    attributes: ['id', 'name', 'isGraduated']
                },
            ],
            raw: true,
            nest: true
        })

        if (data)
            return apiUtils.resFormat(0, "Get ClassGroup by id successful !", data);

        return apiUtils.resFormat(1, "Get ClassGroup by id failed !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getClassGroupsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.ClassGroup.findAndCountAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'isClosed'],
            include: [
                {
                    model: db.Subject,
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: db.RegistrationGroup,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: db.Teacher,
                    attributes: ['id', 'fullName', 'isDeleted']
                },
                {
                    model: db.SchoolYear,
                    attributes: ['id', 'name', 'isGraduated']
                },
            ],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            classGroups: rows
        }

        if (time)
            await apiUtils.delay(time);

        if (rows.length > 0)
            return apiUtils.resFormat(0, "Get classGroups with pagination successful !", data);

        return apiUtils.resFormat(1, "Get classGroups with pagination failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createANewClassGroup = async (classGroup) => {
    try {
        await db.ClassGroup.create({
            name: classGroup.name,
            description: classGroup.description,
            isClosed: 0,
            classGroupId: classGroup.classGroupId
        })

        return apiUtils.resFormat(0, "Create a new classGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createManyClassGroups = async (classGroups) => {
    try {
        let totalClassGroups = 0;
        await Promise.all(classGroups.map(async (classGroup) => {

            let listClassGroups = await Promise.all(classGroup.registrationGroupIds.map((registrationGroupId) => {
                totalClassGroups++;
                let showCode = classGroupCodeUtils.random(7);
                return {
                    subjectId: classGroup.subjectId,
                    registrationGroupId,
                    teacherId: classGroup.teacherId,
                    schoolYearId: classGroup.schoolYearId,
                    showCode,
                    timeline: 'BEFORE',
                    isActive: 1,
                    isClosed: 0
                }
            }))

            await db.ClassGroup.bulkCreate(listClassGroups);
        }))

        return apiUtils.resFormat(0, `Create ${totalClassGroups} classGroups successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateAClassGroup = async (classGroupUpdate) => {
    try {
        await db.ClassGroup.update({
            teacherId: classGroupUpdate.teacherId
        }, {
            where: {
                id: classGroupUpdate.id
            }
        })

        return apiUtils.resFormat(0, "Update a classGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const deleteAClassGroup = async (classGroup) => {
    try {
        if (classGroup.isClosed) {
            await db.ClassGroup.update({ isClosed: +classGroup.isClosed }, {
                where: {
                    id: classGroup.id
                }
            })

            return apiUtils.resFormat(0, `${+classGroup.isClosed === 0 ? 'Open' : 'Close'} a classGroup successful !`);
        }

        // Delete khỏi database
        // Về sau cần xem xét sự ảnh hưởng đối với table Student
        await db.Student_ClassGroup.destroy({
            where: {
                classGroupId: classGroup.id
            }
        })

        await db.ClassGroup.destroy({
            where: {
                id: classGroup.id
            }
        })

        return apiUtils.resFormat(0, "Delete a classGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateTimelineOrActiveAClassGroup = async (classGroup) => {
    try {
        if (classGroup.isActive) {
            await db.ClassGroup.update({
                isActive: +classGroup.isActive,
                timeline: classGroup.timeline
            }, {
                where: {
                    id: classGroup.id
                }
            })

            return apiUtils.resFormat(0, `${+classGroup.isActive === 0 ? 'Inactive' : 'Active'} a classGroup successful !`);
        }

        await db.ClassGroup.update({ timeline: classGroup.timeline }, {
            where: {
                id: classGroup.id
            }
        })

        return apiUtils.resFormat(0, "Delete a classGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateLimitStudentsClassGroup = async (classGroup) => {
    try {
        await db.ClassGroup.update({
            limitStudents: classGroup.limit
        }, {
            where: {
                id: classGroup.id
            }
        })

        // Active classGroup continue attendance
        let dataTimeline = await updateTimelineOrActiveAClassGroup(classGroup);

        if (dataTimeline.EC === 0) {
            return apiUtils.resFormat(0, "Update limit students classGroup successful !");
        }

        return apiUtils.resFormat(1, "Update limit students classGroup failed !");

    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}




export default {
    getAllClassGroups,
    getClassGroupBySubjectId,
    getClassGroupsWithPagination, createANewClassGroup, updateAClassGroup,
    deleteAClassGroup, createManyClassGroups, getClassGroupById,
    getClassGroupByTeacherId, updateTimelineOrActiveAClassGroup,
    updateLimitStudentsClassGroup

}