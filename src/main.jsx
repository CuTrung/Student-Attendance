import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from './components/user/homePage';
import About from './components/user/about';
import IndexManage from './components/user/teachers/manages/indexManage';
import Login from './components/both/login';
import Admin from './components/admin/admin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Attendance from './components/user/students/attendance';
import Profile from './components/user/students/profile';
import IndexStudents from './components/admin/students/indexStudents';
import IndexTeachers from './components/admin/teachers/indexTeachers';
import IndexDepartments from './components/admin/departments/indexDepartments';
import IndexMajors from './components/admin/majors/indexMajors';
import IndexSubjects from './components/admin/subjects/indexSubjects';
import IndexClassGroups from './components/admin/classGroups/indexClassGroups';
import CRUDDepartments from './components/admin/departments/CRUDDepartments';
import IndexRegistrationGroups from './components/admin/registrationGroups/indexRegistrationGroups';
import ManageTimelineClassGroups from './components/user/teachers/manages/manageTimelineClassGroups';
import ManageListSpecialStudents from './components/user/teachers/manages/manageListSpecialStudents';
import ManageAttendanceDetails from './components/user/teachers/manages/manageAttendanceDetails';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>

          <Route index element={<HomePage />} />

          <Route path="login" element={<Login />}>

          </Route>

          <Route path="manage" element={<IndexManage />}>
            <Route index element={<ManageTimelineClassGroups />} />

            <Route path="special" element={<ManageListSpecialStudents />}>

            </Route>
            <Route path="details" element={<ManageAttendanceDetails />}>

            </Route>
          </Route>

          <Route path="about" element={<About />}>

          </Route>

          {/* <Route path="student" element={<Student />}> */}
          <Route path="attendance" element={<Attendance />}>

          </Route>

          <Route path="profile" element={<Profile />}>

          </Route>
          {/* </Route> */}
        </Route>

        <Route path="/admin" element={<Admin />}>

          <Route path="students" element={<IndexStudents />}>

          </Route>

          <Route path="teachers" element={<IndexTeachers />}>

          </Route>

          <Route path="departments" element={<IndexDepartments />}>
            <Route index element={<CRUDDepartments />} />

            <Route path="majors" element={<IndexMajors />}>

            </Route>

            <Route path="subjects" element={<IndexSubjects />}>

            </Route>

            <Route path="registrationGroups" element={<IndexRegistrationGroups />}>

            </Route>

            <Route path="classGroups" element={<IndexClassGroups />}>

            </Route>

          </Route>

        </Route>


      </Routes>
    </BrowserRouter>


    <ToastContainer
      position="top-right"
      autoClose={100}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{ width: "350px" }}
    />

  </>
  // </React.StrictMode>
)
