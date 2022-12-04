import studentController from "../controllers/studentController";
import teacherController from "../controllers/teacherController";
import subjectController from "../controllers/subjectController";
import majorController from "../controllers/majorController";
import departmentController from "../controllers/departmentController";
import classGroupController from "../controllers/classGroupController";
import student_classGroupController from "../controllers/student_classGroupController";
import registrationGroupController from "../controllers/registrationGroupController";
import loginController from "../controllers/loginController";
import attendanceController from "../controllers/attendanceController";
import schoolYearController from "../controllers/schoolYearController";

const studentRoutes = (router) => {
    router.get("/api/students", studentController.getStudents);
    router.post("/api/students", studentController.createANewStudent);
    router.delete("/api/students", studentController.deleteAStudent);
    router.patch("/api/students", studentController.updateAStudent);
}

const teacherRoutes = (router) => {
    router.get("/api/teachers", teacherController.getTeachers);
    router.post("/api/teachers", teacherController.createANewTeacher);
    router.delete("/api/teachers", teacherController.deleteATeacher);
    router.patch("/api/teachers", teacherController.updateATeacher);
}

const schoolYearRoutes = (router) => {
    router.get("/api/schoolYears", schoolYearController.getAllSchoolYears);
}

const loginRoutes = (router) => {
    router.post("/api/login", loginController.login);
}

const attendanceRoutes = (router) => {
    router.post("/api/attendance", attendanceController.attendance);
}

const departmentRoutes = (router) => {
    router.get("/api/departments", departmentController.getDepartments);
    router.post("/api/departments", departmentController.createANewDepartment);
    router.patch("/api/departments", departmentController.updateADepartment);
    router.delete("/api/departments", departmentController.deleteADepartment);
}

const majorRoutes = (router) => {
    router.get("/api/majors", majorController.getMajors);
    // router.post("/api/majors", majorController.createANewMajor);
    router.post("/api/majors", majorController.createManyMajors);
    router.patch("/api/majors", majorController.updateAMajor);
    router.delete("/api/majors", majorController.deleteAMajor);
}

const subjectRoutes = (router) => {
    router.get("/api/subjects", subjectController.getSubjects);
    // router.post("/api/subjects", subjectController.createANewSubject);
    router.post("/api/subjects", subjectController.createManySubjects);
    router.patch("/api/subjects", subjectController.updateASubject);
    router.delete("/api/subjects", subjectController.deleteASubject);
}

const registrationGroupRoutes = (router) => {
    router.get("/api/registrationGroups", registrationGroupController.getRegistrationGroups);
    router.post("/api/registrationGroups", registrationGroupController.createANewRegistrationGroup);
    router.patch("/api/registrationGroups", registrationGroupController.updateARegistrationGroup);
    router.delete("/api/registrationGroups", registrationGroupController.deleteARegistrationGroup);
}

const classGroupRoutes = (router) => {
    router.get("/api/classGroups", classGroupController.getClassGroups);
    // router.post("/api/classGroups", classGroupController.createANewClassGroup);
    router.post("/api/classGroups", classGroupController.createManyClassGroups);
    router.patch("/api/classGroups", classGroupController.updateAClassGroup);
    router.delete("/api/classGroups", classGroupController.deleteAClassGroup);
}

const student_classGroupRoutes = (router) => {
    router.get("/api/student_classGroups", student_classGroupController.getStudent_ClassGroups);
    // router.post("/api/student_classGroups", student_classGroupController.createANewStudent_ClassGroup);
    router.post("/api/student_classGroups", student_classGroupController.createManyStudent_ClassGroups);
    router.patch("/api/student_classGroups", student_classGroupController.updateAStudent_ClassGroup);
    router.delete("/api/student_classGroups", student_classGroupController.deleteAStudent_ClassGroup);
}

const manageRoutes = (router) => {
    router.get("/api/manage-classGroups/:teacherId", classGroupController.getClassGroupByTeacherId);
    router.post("/api/manage-classGroups", classGroupController.updateTimelineOrActiveAClassGroup);
}

const student_classGroupVirtualRoutes = (router) => {
    router.post("/api/student_classGroupVirtual", classGroupController.getClassGroupVirtualByClassGroupId);
}

export default {
    studentRoutes, teacherRoutes, schoolYearRoutes, departmentRoutes,
    majorRoutes, subjectRoutes, registrationGroupRoutes, classGroupRoutes,
    student_classGroupRoutes, student_classGroupVirtualRoutes,
    loginRoutes, attendanceRoutes, manageRoutes
};