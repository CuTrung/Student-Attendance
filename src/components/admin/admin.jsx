import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

const Admin = (props) => {
    return (
        <div className="main row container-fluid">
            <div className="col-3">
                <Sidebar />
            </div>
            <div className="col-9">
                <Outlet />
            </div>
        </div>

    )
}

export default Admin;