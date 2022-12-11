import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import classGroupServices from "../classGroup/classGroupServices";
import { Op } from "sequelize";
import studentServices from "../student/studentServices";
import student_classGroupServices from "../student_classGroup/student_classGroupServices";

const createAttendanceDetails = async (dataAttendance) => {
    try {
        let classGroupId = dataAttendance.classGroupId;
        let studentIdsStatus = dataAttendance.studentIdsStatus;

        // Nếu đã create Attendance Details trước đó thì chỉ cần update
        // lại, có thể dựa vào createdAt nhưng chưa khả thi (có thể classGroup
        // đó vừa học sáng và chiều trong cùng 1 ngày)



        // Increase numberOf... in table Student_ClassGroup
        for await (const key of Object.keys(studentIdsStatus)) {
            if (key !== 'studentAttendIds') {
                for await (const studentId of await JSON.parse(studentIdsStatus[key])) {
                    await student_classGroupServices.updateNumberOf(key.replace('StudentIds', '').toUpperCase(), studentId, classGroupId)
                }
            }
        }


        let data = await db.AttendanceDetails.create({
            ...studentIdsStatus,
            classGroupId,
        })

        if (data)
            return apiUtils.resFormat(0, "Create Attendance Details successful! ");
        return apiUtils.resFormat(1, "Create Attendance Details failed! ");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getAttendanceDetailsByClassGroupId = async (classGroupId) => {
    try {

        let dataAttendanceDetails = await db.AttendanceDetails.findAll({
            where: { classGroupId },
            attributes: [
                'studentAttendIds', 'absentStudentIds',
                'lateStudentIds', 'lieStudentIds', 'createdAt'
            ],
            raw: true,
            nest: true,
        })

        let data = await Promise.all(dataAttendanceDetails.map(async (item) => {
            for (const key of Object.keys(item)) {
                if (key !== 'createdAt') {
                    let arrStudentIds = await JSON.parse(item[key]);

                    item[key] = await Promise.all(arrStudentIds.map(async (studentId) => {
                        let dataStudent = await studentServices.getStudentById(studentId);

                        return {
                            id: dataStudent.DT.id,
                            fullName: dataStudent.DT.fullName,
                            email: dataStudent.DT.email
                        }
                    }))
                } else {
                    item[key] = item[key].toISOString().split('T')[0];
                }
            }

            return {
                studentAttends: item.studentAttendIds,
                absentStudents: item.absentStudentIds,
                lateStudents: item.lateStudentIds,
                lieStudents: item.lieStudentIds,
                date: item.createdAt.split("-").reverse().join("/")
            }
        }))


        if (data.length > 0)
            return apiUtils.resFormat(0, "Get Attendance Details by classGroupId successful! ", data);


        return apiUtils.resFormat(1, "Get Attendance Details by classGroupId failed! ");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}




export default {
    createAttendanceDetails, getAttendanceDetailsByClassGroupId
}