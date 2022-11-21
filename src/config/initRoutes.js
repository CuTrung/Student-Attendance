import express from 'express';
const router = express.Router();

import studentController from '../controllers/studentController';
import schoolYearController from '../controllers/schoolYearController';
import majorController from '../controllers/majorController';
import loginController from '../controllers/loginController';
import attendanceController from '../controllers/attendanceController';
import teacherController from '../controllers/teacherController';


const initRoutes = (app) => {
    // API Students
    router.get("/api/students", studentController.getStudents);
    router.post("/api/students", studentController.createANewStudent);
    router.delete("/api/students", studentController.deleteAStudent);
    router.patch("/api/students", studentController.updateAStudent);

    // API Teachers
    router.get("/api/teachers", teacherController.getTeachers);
    router.post("/api/teachers", teacherController.createANewTeacher);
    router.delete("/api/teachers", teacherController.deleteATeacher);
    router.patch("/api/teachers", teacherController.updateATeacher);

    // API SchoolYear
    router.get("/api/school-years", schoolYearController.getAllSchoolYears);

    // API Major
    router.get("/api/majors", majorController.getAllMajors);

    // API Login
    router.post("/api/login", loginController.login);

    // API Attendance
    router.post("/api/attendance", attendanceController.attendance);

    // API Manage





    return app.use("/", router);
}

export default initRoutes;