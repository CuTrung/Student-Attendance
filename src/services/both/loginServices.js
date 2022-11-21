import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import studentServices from "../student/studentServices";
import teacherServices from "../teachers/teacherServices";
import roleServices from "../role/roleServices";
import passwordUtils from "../../utils/passwordUtils";
import jwtUtils from "../../utils/jwtUtils";

import { Op } from "sequelize";

const login = async (user) => {
    try {
        // ADMIN 
        // ...


        // Nếu là lần đầu login sẽ dựa vào format email để biết user 
        // là STUDENT hay TEACHER (có thể cả ADMIN)

        // Email student thường bắt đầu bằng mã số SV, email Teacher thì ko
        let isEmailStartsWithNumber = /^\d/.test(user.email);
        if (isEmailStartsWithNumber) {
            // STUDENT
            let isExistStudent = await studentServices.getStudentByEmail(user.email);
            if (isExistStudent.DT) {
                let student = isExistStudent.DT;
                let isCorrectPassword = passwordUtils.checkHashPassword(user.password, student.password.split(process.env.SECRET_KEY)[0])
                if (isCorrectPassword) {
                    let dataRoles = await roleServices.getRoleByGroupId(student.groupId);

                    // token
                    let token = jwtUtils.createToken({
                        ...dataRoles.DT,
                        id: student.id
                    });

                    let data = {
                        fullName: student.fullName,
                        email: student.email,
                        access_token: token
                    }

                    return apiUtils.resFormat(0, "Login successful !", data);
                }
            }

        }

        if (!isEmailStartsWithNumber) {
            // TEACHER
            let isExistTeacher = await teacherServices.getTeacherByEmail(user.email);
            if (isExistTeacher.DT) {
                let teacher = isExistTeacher.DT;
                let isCorrectPassword = passwordUtils.checkHashPassword(user.password, teacher.password.split(process.env.SECRET_KEY)[0])
                if (isCorrectPassword) {
                    let dataRoles = await roleServices.getRoleByGroupId(teacher.groupId);

                    // token
                    let token = jwtUtils.createToken({
                        ...dataRoles.DT,
                        id: teacher.id
                    });

                    let data = {
                        fullName: teacher.fullName,
                        email: teacher.email,
                        access_token: token
                    }

                    return apiUtils.resFormat(0, "Login successful !", data);
                }
            }
        }




        return apiUtils.resFormat(1, "Login failed ! Try again");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    login
}