import db from "../../models";
import apiUtils from '../../utils/apiUtils';
import passwordUtils from "../../utils/passwordUtils";
import { Op } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const getAllStudents = async () => {
    try {
        let data = await db.Student.findAll({
            where: { isDeleted: 0 },
            attributes: ['id', 'fullName', 'email', 'password'],
            include: [
                {
                    model: db.SchoolYear,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: db.Major,
                    attributes: ['id', 'name', 'description'],
                }
            ],
            raw: true,
            nest: true
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get all students successful !", data);

        return apiUtils.resFormat(1, "Get all students failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStudentByEmail = async (email) => {
    try {
        let data = await db.Student.findOne({
            where: {
                [Op.and]: [
                    { isDeleted: 0 },
                    { email },
                ]
            },
            attributes: ['id', 'fullName', 'email', 'password', 'groupId'],
            include: [
                {
                    model: db.SchoolYear,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: db.Major,
                    attributes: ['id', 'name', 'description'],
                }
            ],
            raw: true,
            nest: true
        })

        if (data)
            return apiUtils.resFormat(0, "Get student by email successful !", data);

        return apiUtils.resFormat(1, "Not found student by email !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStudentById = async (id) => {
    try {
        let data = await db.Student.findOne({
            where: {
                [Op.and]: [
                    { isDeleted: 0 },
                    { id },
                ]
            },
            attributes: ['id', 'fullName', 'email', 'password', 'groupId',],
            include: [
                {
                    model: db.SchoolYear,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: db.Major,
                    attributes: ['id', 'name', 'description'],
                }
            ],
            raw: true,
            nest: true
        })

        if (data)
            return apiUtils.resFormat(0, "Get student by id successful !", data);

        return apiUtils.resFormat(1, "Not found student by id !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStudentsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Student.findAndCountAll({
            attributes: ['fullName', 'email', 'password', 'isDeleted'],
            include: [
                {
                    model: db.SchoolYear,
                    attributes: ['id', 'name', 'description'],
                },
                {
                    model: db.Major,
                    attributes: ['id', 'name', 'description'],
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
            students: rows
        }

        if (time)
            await apiUtils.delay(time);

        if (rows.length > 0)
            return apiUtils.resFormat(0, "Get students with pagination successful !", data);

        return apiUtils.resFormat(1, "Get students with pagination failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createANewStudent = async (student) => {
    try {
        const hashPassword = passwordUtils.hashPassword(student.password);
        await db.Student.create({
            fullName: student.fullName,
            email: student.email,
            password: hashPassword,
            majorId: student.majorId,
            schoolYearId: student.schoolYearId,
            isDeleted: 0,
            groupId: '3'
        })

        return apiUtils.resFormat(0, "Create a new student successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}

const deleteAStudent = async (student) => {
    try {
        if (student.isDeleted) {
            await db.Student.update({ isDeleted: +student.isDeleted }, {
                where: {
                    email: student.email
                }
            })

            return apiUtils.resFormat(0, `${+student.isDeleted === 0 ? 'Active' : 'Inactive'} a student successful !`);
        }

        // Delete khỏi database
        await db.Student.destroy({
            where: {
                email: student.email
            }
        })

        return apiUtils.resFormat(0, "Delete a student successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateAStudent = async (studentUpdate) => {
    try {
        const hashPassword = passwordUtils.hashPassword(studentUpdate.password);
        await db.Student.update({
            fullName: studentUpdate.fullName,
            email: studentUpdate.email,
            password: hashPassword,
            majorId: studentUpdate.majorId,
            schoolYearId: studentUpdate.schoolYearId,
        }, {
            where: {
                email: studentUpdate.emailUpdate
            }
        })

        return apiUtils.resFormat(0, "Update a student successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}





export default {
    getAllStudents, createANewStudent, deleteAStudent, updateAStudent,
    getStudentsWithPagination, getStudentByEmail, getStudentById,

}