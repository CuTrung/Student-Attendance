import db from "../../models";
import apiUtils from '../../utils/apiUtils';
import passwordUtils from "../../utils/passwordUtils";
import majorServices from "../major/majorServices";
import classGroupServices from "../classGroup/classGroupServices";
import subjectServices from "../subject/subjectServices";
import { Op } from "sequelize";
import dotenv from 'dotenv';
import _ from 'lodash';
dotenv.config();

const getAllTeachers = async () => {
    try {
        let data = await db.Teacher.findAll({
            // where: { isDeleted: 0 },
            attributes: ['id', 'fullName', 'email', 'password', 'isDeleted'],
            raw: true,
            nest: true
        })


        if (data.length > 0)
            return apiUtils.resFormat(0, "Get all Teachers successful !", data);

        return apiUtils.resFormat(1, "Get all Teachers failed !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getTeacherByEmail = async (email) => {
    try {
        let teacher = await db.Teacher.findOne({
            where: {
                [Op.and]: [
                    { isDeleted: 0 },
                    { email: email },
                ]
            },
            attributes: ['id', 'fullName', 'email', 'password', 'groupId'],
            raw: true,
            nest: true
        })

        let majors, classGroup;
        if (teacher) {
            classGroup = await classGroupServices.getClassGroupByTeacherId(teacher.id)
            if (classGroup.DT.length > 0) {
                majors = await Promise.all(classGroup.DT.map(async (item) => {
                    let dataMajor = await majorServices.getMajorsById(item.majorId);
                    return dataMajor.DT;
                }))
            }
        }


        let data = {
            ...teacher,
            classGroup: classGroup.DT,
            major: majors
        }

        if (teacher)
            return apiUtils.resFormat(0, "Get Teacher by email successful !", data);

        return apiUtils.resFormat(0, "Get Teacher by email failed !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getTeachersWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Teacher.findAndCountAll({
            // where: { isDeleted: 0 },
            attributes: ['id', 'fullName', 'email', 'password', 'isDeleted'],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })


        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            teachers: rows
        }

        if (time)
            await apiUtils.delay(time);


        if (rows.length > 0)
            return apiUtils.resFormat(0, "Get Teachers with pagination successful !", data);

        return apiUtils.resFormat(1, "Get Teachers with pagination failed !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createANewTeacher = async (teacher) => {
    try {
        const hashPassword = passwordUtils.hashPassword(teacher.password);
        await db.Teacher.create({
            fullName: teacher.fullName,
            email: teacher.email,
            password: hashPassword,
            isDeleted: 0,
            groupId: '2'
        })

        return apiUtils.resFormat(0, "Create a new Teacher successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}

const deleteATeacher = async (teacher) => {
    try {
        if (teacher.isDeleted) {
            await db.Teacher.update({ isDeleted: +teacher.isDeleted }, {
                where: {
                    email: teacher.email
                }
            })

            return apiUtils.resFormat(0, `${+teacher.isDeleted === 0 ? 'Active' : 'Inactive'} a teacher successful !`);
        }

        // Delete khỏi database
        await db.Teacher.destroy({
            where: {
                email: teacher.email
            }
        })

        return apiUtils.resFormat(0, "Delete a Teacher successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateATeacher = async (teacherUpdate) => {
    try {
        const hashPassword = passwordUtils.hashPassword(teacherUpdate.password);
        await db.Teacher.update({
            fullName: teacherUpdate.fullName,
            email: teacherUpdate.email,
            password: hashPassword,
        }, {
            where: {
                email: teacherUpdate.emailUpdate
            }
        })

        return apiUtils.resFormat(0, "Update a Teacher successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}



export default {
    getAllTeachers, createANewTeacher, deleteATeacher, updateATeacher,
    getTeachersWithPagination, getTeacherByEmail
}