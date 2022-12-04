import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import studentServices from "../student/studentServices";
import { Op } from "sequelize";

const attendance = async (studentId, showId, status = 'BEFORE') => {
    try {
        // Đảm bảo student đó có isDeleted = 0 nên vẫn phải gọi func này,
        // cần tìm cách improve
        let student = await studentServices.getStudentById(studentId);


        if (student.DT) {
            let dataClassGroupIds = await db.Student_ClassGroup.findAll({
                where: { studentId },
                attributes: ['classGroupId'],
                raw: true,
            })

            let classGroupIds = dataClassGroupIds.map((item) => item.classGroupId);
            if (classGroupIds.length > 0) {
                let dataClassGroupId = await db.Code.findOne({
                    where: {
                        [Op.and]: [
                            { showId },
                            { status },
                        ]
                    },
                    attributes: ['classGroupId'],
                    raw: true,
                })

                // Student is study this classGroup
                if (dataClassGroupId) {
                    if (classGroupIds.includes(+dataClassGroupId.classGroupId)) {
                        await db.Student_ClassGroupVirtual.create({
                            studentId,
                            classGroupId: dataClassGroupId.classGroupId,
                            timeline: status
                        })

                        return apiUtils.resFormat(0, "Attendance successful !");
                    }

                    return apiUtils.resFormat(1, "You can't attendance this group!");

                } else {
                    return apiUtils.resFormat(1, "Attendance failed ! Try again");
                }
            }
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