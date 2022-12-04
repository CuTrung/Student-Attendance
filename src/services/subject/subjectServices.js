import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";

const getAllSubjects = async () => {
    try {
        let dataSubjects = await db.Subject.findAll({
            where: { isClosed: 0 },
            attributes: ['id', 'name', 'description'],
            include: [
                {
                    model: db.Major,
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                }
            ],
            nest: true,
            raw: true,
        })


        // Dựa vào vòng loop này để improve các vòng loop map có Promise.All
        let data = [];
        dataSubjects.forEach(subject => {
            // Convert Majors to obj of array
            subject = { ...subject, Majors: [subject.Majors] }

            let match = data.find(r => r.id === subject.id);
            if (match) {
                match.Majors = match.Majors.concat(subject.Majors);
            } else {
                data.push(subject);
            }
        });

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get all Subject successful !", data);

        return apiUtils.resFormat(1, "Get all Subject failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getSubjectsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Subject.findAndCountAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'name', 'description', 'isClosed'],
            include: [
                {
                    model: db.Major,
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                }
            ],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        let result = [];
        rows.forEach(subject => {
            // Convert Majors to obj of array
            subject = { ...subject, Majors: [subject.Majors] }

            let match = result.find(r => r.id === subject.id);
            if (match) {
                match.Majors = match.Majors.concat(subject.Majors);
                // Vì gộp majors của subject tương ứng nên cần set lại count tương ứng
                count--;
            } else {
                result.push(subject);
            }
        });

        rows = result;

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            subjects: rows
        }

        if (time)
            await apiUtils.delay(time);

        if (rows.length > 0)
            return apiUtils.resFormat(0, "Get subjects with pagination successful !", data);

        return apiUtils.resFormat(1, "Get subjects with pagination failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getSubjectByTeacherId = async (teacherId) => {
    try {
        let data = await db.ClassGroup.findAll({
            where: {
                [Op.and]: [
                    { isClosed: 0 },
                    { teacherId },
                ]
            },
            attributes: ['subjectId'],
            raw: true,
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get Subject by teacherId successful !", data);

        return apiUtils.resFormat(1, "Get Subject by teacherId failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createANewSubject = async (subject) => {
    try {
        await db.Subject.create({
            name: subject.name,
            description: subject.description,
            isClosed: 0,
            subjectId: subject.subjectId
        })

        return apiUtils.resFormat(0, "Create a new subject successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createManySubjects = async (dataSubjects) => {
    try {
        let totalSubjects = 0;
        await Promise.all(dataSubjects.map(async (item) => {
            let listSubjects = item.subjects;
            let majorIds = item.majorIds;
            listSubjects = await listSubjects.map((subject) => ({ ...subject, isClosed: 0 }))

            let subjects = await db.Subject.bulkCreate(listSubjects);

            let listMajor_Subject = await Promise.all(subjects.map(async (itemSubject) => {
                let subjectObj = itemSubject.get({ plain: true });
                let listMajor_Subject = await majorIds.map((majorId) => {
                    return {
                        subjectId: subjectObj.id,
                        majorId
                    }
                })

                totalSubjects += itemSubject.length

                return listMajor_Subject;
            }))

            await Promise.all(listMajor_Subject.map(async (dataList) => {
                await db.Major_Subject.bulkCreate(dataList);
            }))
        }))

        return apiUtils.resFormat(0, `Create ${totalSubjects} subjects successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateASubject = async (subjectUpdate) => {
    try {
        let listMajor_Subject = await subjectUpdate.majorIds.map((majorId) => {
            return {
                subjectId: subjectUpdate.id,
                majorId
            }
        })

        await db.Major_Subject.destroy({
            where: {
                subjectId: subjectUpdate.id
            }
        })

        await db.Subject.update({
            name: subjectUpdate.name,
            description: subjectUpdate.description,
        }, {
            where: {
                id: subjectUpdate.id
            }
        })

        await db.Major_Subject.bulkCreate(listMajor_Subject);

        return apiUtils.resFormat(0, "Update a subject successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const deleteASubject = async (subject) => {
    try {
        if (subject.isClosed) {
            await db.Subject.update({ isClosed: +subject.isClosed }, {
                where: {
                    id: subject.id
                }
            })

            return apiUtils.resFormat(0, `${+subject.isClosed === 0 ? 'Open' : 'Close'} a subject successful !`);
        }

        // Delete khỏi database
        await db.Major_Subject.destroy({
            where: {
                subjectId: subject.id
            }
        })

        await db.Subject.destroy({
            where: {
                id: subject.id
            }
        })

        return apiUtils.resFormat(0, "Delete a subject successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getSubjectByTeacherId, getSubjectsWithPagination, getAllSubjects,
    createANewSubject, createManySubjects, updateASubject, deleteASubject
}