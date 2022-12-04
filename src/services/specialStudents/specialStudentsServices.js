import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import classGroupServices from "../classGroup/classGroupServices";
import { Op } from "sequelize";

const createSpecialStudents = async (listClassGroupsVirtual) => {
    try {
        if (listClassGroupsVirtual.length > 0) {
            let lateStudentIds = [];
            let studentAttendIds = [];
            let listSpecialStudents = listClassGroupsVirtual.filter((item) => {
                if (item.timeline.length === 1) {
                    let status;

                    if (item.timeline[0] === 'BEFORE' || item.timeline[0] === 'LATE') {

                        if (item.timeline[0] === 'BEFORE') {
                            status = 'LIE | ABSENT';

                            // Student kiện vì AFTER ko điểm danh được, 
                            // chắc chắn có student LIE
                            // (teacher xử lí bằng miệng trong TH ko tồn tại 
                            // student chỉ có timeline = 'AFTER')
                        }

                        if (item.timeline[0] === 'LATE') {
                            // TH1: student ko có mặt trực tiếp để kiện
                            status = 'LIE | ABSENT'


                            // TH2: Student kiện vì ko điểm danh được AFTER 
                            // => Chắc chắn có student LIE trong studentAttendIds
                            // vì timeline AFTER lúc này đã có limit
                            // (teacher xử lí bằng miệng trong TH ko tồn tại 
                            // student chỉ có timeline = 'AFTER')

                        }
                    } else {
                        // Có thể student này lấy mất chỗ của student ở một
                        // trong hai TH trên. Nếu rơi vào TH này, đồng thời
                        // có student kiện thì Lúc này cần xác minh student 
                        // kiện xem có đúng là tồn tại BEFORE hoặc LATE 
                        // (tức là có điểm danh trước đó), nếu đúng thì 
                        // insert vào studentAttendIds

                        status = 'ABSENT | LIE';
                    }
                    return {
                        studentId: item.studentId,
                        status: 'ABSENT'
                    }
                } else {
                    // Insert to Attendance Details
                    // Insert lateStudentIds
                    if (item.timeline.includes('LATE')) {
                        lateStudentIds.push(item.studentId);
                    }

                    // Insert studentAttendIds
                    studentAttendIds.push(item.studentId);


                    // Sau khi Insert, nếu có student kiện, lúc này có thể
                    // tồn tại student LIE trong column studentAttendIds,
                    // cần update lại table 
                    // Attendance Details
                }
            })

            console.log(">>> Check data", listClassGroupsVirtual)
        }


        return apiUtils.resFormat(1, "Create Special Students successful! ");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}




export default {
    createSpecialStudents
}