import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";

const getAllDepartments = async () => {
    try {
        let data = await db.Department.findAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'name', 'description'],
            raw: true,
            nest: true
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get all departments successful !", data);

        return apiUtils.resFormat(1, "Get all departments failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getDepartmentsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Department.findAndCountAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'name', 'description', 'isClosed'],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            departments: rows
        }

        if (time)
            await apiUtils.delay(time);

        if (rows.length > 0)
            return apiUtils.resFormat(0, "Get departments with pagination successful !", data);

        return apiUtils.resFormat(1, "Get departments with pagination failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createANewDepartment = async (department) => {
    try {
        await db.Department.create({
            name: department.name,
            description: department.description,
            isClosed: 0
        })

        return apiUtils.resFormat(0, "Create a new department successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateADepartment = async (departmentUpdate) => {
    try {
        await db.Department.update({
            name: departmentUpdate.name,
            description: departmentUpdate.description,
        }, {
            where: {
                id: departmentUpdate.id
            }
        })

        return apiUtils.resFormat(0, "Update a department successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const deleteADepartment = async (department) => {
    try {
        if (department.isClosed) {
            await db.Department.update({ isClosed: +department.isClosed }, {
                where: {
                    id: department.id
                }
            })

            return apiUtils.resFormat(0, `${+department.isClosed === 0 ? 'Open' : 'Close'} a department successful !`);
        }

        // Delete khỏi database
        await db.Department.destroy({
            where: {
                id: department.id
            }
        })

        return apiUtils.resFormat(0, "Delete a department successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

export default {
    getAllDepartments, getDepartmentsWithPagination,
    createANewDepartment, updateADepartment,
    deleteADepartment
}