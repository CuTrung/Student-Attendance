import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import classGroupServices from "../classGroup/classGroupServices";
import { Op } from "sequelize";
import studentServices from "../student/studentServices";
import student_classGroupServices from "../student_classGroup/student_classGroupServices";

const createSpecialStudents = async (listClassGroupsVirtual) => {
    try {

        if (listClassGroupsVirtual.length > 0) {
            let listSpecialStudents = listClassGroupsVirtual.map((item) => {
                let status;
                let arrBeforeAndLate = ['BEFORE', 'LATE'];
                let isOnlyBothBeforeAndLate = (arr) => {
                    return arrBeforeAndLate.every(v => arr.includes(v));
                }

                // ['BEFORE'] | ['LATE'] | ['AFTER'] | ['BEFORE', 'LATE']
                if (item.timeline.length === 1 || isOnlyBothBeforeAndLate(item.timeline)) {
                    // TH1: Ko điểm danh trước đó mà chỉ điểm danh cuối giờ
                    // TH2: Chỉ điểm danh đầu giờ, cuối giờ ko điểm danh
                    // (có thể student ko có mặt tại lớp nên ko biết phải
                    // điểm danh cuối giờ)
                    // TH3: Điểm danh ko được vì có student LIE chiếm chỗ
                    // Mặc định vẫn là LIE | ABSENT, student phải có mặt 
                    // trực tiếp tại lớp để kiện, sẽ gửi thông báo về
                    // cho student là đã điểm danh được AFTER chưa
                    // Lúc này teacher cần điểm danh miệng

                    status = 'LIE | ABSENT';
                }

                // ['LATE', 'AFTER'] | ['BEFORE', 'AFTER'] | ['BEFORE', 'LATE', 'AFTER']
                if (item.timeline.length === 2 || item.timeline.length === 3) {
                    if (item.timeline.includes('LATE'))
                        status = 'LATE | ATTEND';

                    // Check status có được gán value trước đó chưa
                    if (!status)
                        status = 'ATTEND';

                }

                return {
                    studentId: item.studentId,
                    classGroupId: item.classGroupId,
                    status
                }
            })

            await db.SpecialStudents.bulkCreate(listSpecialStudents);

            return apiUtils.resFormat(0, "Create Special Students successful! ");
        }

        return apiUtils.resFormat(1, "Create Special Students failed! ");

    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


const getSpecialStudentsByClassGroupId = async (classGroupId) => {
    try {
        let dataVirtual = await student_classGroupServices.getStudent_classGroupVirtualByClassGroupId(classGroupId);

        let dataDeleteSpecialStudents = await deleteSpecialStudents(classGroupId);

        if (dataDeleteSpecialStudents.EC === 0) {
            let dataCreateSpecialStudents = await createSpecialStudents(dataVirtual.DT);

            if (dataCreateSpecialStudents.EC === 0) {
                let specialStudents = await db.SpecialStudents.findAll({
                    where: { classGroupId },
                    attributes: ['studentId', 'status', 'classGroupId'],
                    raw: true,
                    nest: true
                })

                let data;
                if (specialStudents.length > 0) {
                    data = await Promise.all(specialStudents.map(async (item) => {
                        let studentSpecial = await studentServices.getStudentById(item.studentId);
                        let student_classGroupSpecial = await student_classGroupServices.getStudent_ClassGroupByStudentIdAndClassGroupId(item.studentId, item.classGroupId);
                        return {
                            id: studentSpecial.DT.id,
                            fullName: studentSpecial.DT.fullName,
                            email: studentSpecial.DT.email,
                            numberOfLies: student_classGroupSpecial.DT.numberOfLies,
                            numberOfTimesBeingLate: student_classGroupSpecial.DT.numberOfTimesBeingLate,
                            status: item.status,
                            classGroupId: item.classGroupId,
                        }
                    }))
                }

                return apiUtils.resFormat(0, "Get Special Students successful! ", data);
            }

        }

        return apiUtils.resFormat(1, "Get Special Students failed! ");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const deleteSpecialStudents = async (classGroupId) => {
    try {

        if (classGroupId) {
            await db.SpecialStudents.destroy({
                where: { classGroupId },
            })

            return apiUtils.resFormat(0, "Delete Special Students by classGroupId successful! ");
        }


        await db.SpecialStudents.destroy({
            where: {},
            truncate: true
        })

        return apiUtils.resFormat(0, "Delete Special Students successful! ");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}




export default {
    createSpecialStudents, getSpecialStudentsByClassGroupId,
}