import express from 'express';
const router = express.Router();
import apiRoutes from './apiRoutes';

const initRoutes = (app) => {

    apiRoutes.studentRoutes(router);
    apiRoutes.teacherRoutes(router);
    apiRoutes.schoolYearRoutes(router);
    apiRoutes.loginRoutes(router);
    apiRoutes.attendanceRoutes(router);
    apiRoutes.departmentRoutes(router);
    apiRoutes.majorRoutes(router);
    apiRoutes.subjectRoutes(router);
    apiRoutes.registrationGroupRoutes(router);
    apiRoutes.classGroupRoutes(router);
    apiRoutes.student_classGroupRoutes(router);
    apiRoutes.manageRoutes(router);
    apiRoutes.specialStudentsRoutes(router);
    apiRoutes.attendanceDetailsRoutes(router);


    return app.use("/", router);
}

export default initRoutes;