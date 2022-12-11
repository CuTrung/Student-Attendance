import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import studentServices from "../student/studentServices";
import classGroupServices from "../classGroup/classGroupServices";
import student_classGroupServices from "../student_classGroup/student_classGroupServices";
import { Op } from "sequelize";

const attendance = async (user) => {
    try {
        if (user.role === 'STUDENT') {
            // Đảm bảo student đó có isDeleted = 0 nên vẫn phải gọi func này,
            // cần tìm cách improve
            let studentData = await studentServices.getStudentById(user.id);

            if (studentData.DT) {
                let student = studentData.DT;
                let dataClassGroupIds = await db.Student_ClassGroup.findAll({
                    where: { studentId: student.id },
                    attributes: ['classGroupId'],
                    raw: true,
                })

                let classGroupIds = dataClassGroupIds.map((item) => +item.classGroupId);
                if (classGroupIds.length > 0) {
                    let dataClassGroup = await db.ClassGroup.findOne({
                        where: { showCode: user.showCode },
                        attributes: ['id', 'timeline', 'limitStudents', 'isActive'],
                        raw: true,
                    })


                    // isActive === '1' mới cho student attendance
                    if (dataClassGroup.isActive === 0) {
                        return apiUtils.resFormat(1, "Class group is inactive, can't attendance now !");
                    }

                    // Student is study this classGroup
                    if (dataClassGroup) {
                        if (classGroupIds.includes(+dataClassGroup.id)) {
                            // Check limit if timeline === 'AFTER'
                            if (dataClassGroup.timeline === 'AFTER') {
                                let dataLimit = await student_classGroupServices.countOrLimitStudent_classGroupVirtualByClassGroupId('AFTER', dataClassGroup.id, +dataClassGroup.limitStudents);

                                if (dataLimit.EC === 1) {
                                    return apiUtils.resFormat(1, "Attendance failed because class group is full !");
                                }
                            }

                            const [virtual, created] = await db.Student_ClassGroupVirtual.findOrCreate({
                                where: {
                                    [Op.and]: [
                                        { studentId: student.id },
                                        { timeline: dataClassGroup.timeline }
                                    ],
                                },
                                defaults: {
                                    studentId: student.id,
                                    classGroupId: dataClassGroup.id,
                                    timeline: dataClassGroup.timeline
                                }
                            });

                            if (created)
                                return apiUtils.resFormat(0, "Attendance successful !");

                            return apiUtils.resFormat(0, "You have already attended !");
                        }

                        return apiUtils.resFormat(1, "You can't attendance this group!");
                    } else {
                        return apiUtils.resFormat(1, "Attendance failed ! Try again");
                    }
                }
            }
        }

        // Về sau có thể phát triển thêm điểm danh cho Teacher
        if (user.role === 'TEACHER') {

        }

        return apiUtils.resFormat(1, "Attendance failed ! Try again");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}




export default {
    attendance
}