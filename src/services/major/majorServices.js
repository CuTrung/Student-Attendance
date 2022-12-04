import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";

const getAllMajors = async () => {
    try {
        let data = await db.Major.findAll({
            where: { isClosed: 0 },
            attributes: ['id', 'name', 'description'],
            raw: true,
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get all Major successful !", data);

        return apiUtils.resFormat(1, "Get all Major failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getMajorsById = async (majorId) => {
    try {
        let data = await db.Major.findOne({
            where: {
                [Op.and]: [
                    { isClosed: 0 },
                    { id: majorId },
                ],
            },
            attributes: ['id', 'name', 'description'],
            raw: true,
        })

        if (data)
            return apiUtils.resFormat(0, "Get Major by Id successful !", data);

        return apiUtils.resFormat(1, "Not found Major by Id !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getMajorsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Major.findAndCountAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'name', 'description', 'isClosed'],
            include: [
                {
                    model: db.Department,
                    attributes: ['id', 'description'],
                }
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
            majors: rows
        }

        if (time)
            await apiUtils.delay(time);

        if (rows.length > 0)
            return apiUtils.resFormat(0, "Get majors with pagination successful !", data);

        return apiUtils.resFormat(1, "Get majors with pagination failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createANewMajor = async (major) => {
    try {
        await db.Major.create({
            name: major.name,
            description: major.description,
            isClosed: 0,
            majorId: major.majorId
        })

        return apiUtils.resFormat(0, "Create a new major successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createManyMajors = async (listMajors) => {
    try {
        listMajors = listMajors.map(major => ({ ...major, isClosed: 0 }))
        let majors = await db.Major.bulkCreate(listMajors);
        return apiUtils.resFormat(0, `Create ${majors.length} majors successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateAMajor = async (majorUpdate) => {
    try {
        await db.Major.update({
            name: majorUpdate.name,
            description: majorUpdate.description,
            departmentId: majorUpdate.departmentId
        }, {
            where: {
                id: majorUpdate.id
            }
        })

        return apiUtils.resFormat(0, "Update a major successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const deleteAMajor = async (major) => {
    try {
        if (major.isClosed) {
            await db.Major.update({ isClosed: +major.isClosed }, {
                where: {
                    id: major.id
                }
            })

            return apiUtils.resFormat(0, `${+major.isClosed === 0 ? 'Open' : 'Close'} a major successful !`);
        }

        // Delete khỏi database
        // Về sau cần xem xét sự ảnh hưởng đối với table Student
        await db.Major_Subject.destroy({
            where: {
                majorId: major.id
            }
        })

        await db.Major.destroy({
            where: {
                id: major.id
            }
        })

        return apiUtils.resFormat(0, "Delete a major successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getAllMajors, getMajorsById,
    getMajorsWithPagination, createANewMajor, updateAMajor,
    deleteAMajor, createManyMajors
}