import express from 'express';
const router = express.Router();

import studentController from '../controllers/studentController';
import schoolYearController from '../controllers/schoolYearController';
import majorController from '../controllers/majorController';
import loginController from '../controllers/loginController';
import attendanceController from '../controllers/attendanceController';
import teacherController from '../controllers/teacherController';
import departmentController from '../controllers/departmentController';


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


    // API Login
    router.post("/api/login", loginController.login);

    // API Attendance
    router.post("/api/attendance", attendanceController.attendance);

    // API Manage

    // API Departments
    router.get("/api/departments", departmentController.getDepartments);
    router.post("/api/departments", departmentController.createANewDepartment);
    router.patch("/api/departments", departmentController.updateADepartment);
    router.delete("/api/departments", departmentController.deleteADepartment);

    // API Major
    router.get("/api/majors", majorController.getMajors);
    // router.post("/api/majors", majorController.createANewMajor);
    router.post("/api/majors", majorController.createManyMajors);
    router.patch("/api/majors", majorController.updateAMajor);
    router.delete("/api/majors", majorController.deleteAMajor);



    return app.use("/", router);
}

export default initRoutes;