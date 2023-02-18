import { Link } from "react-router-dom";
const Profile = (props) => {
    return (
        <>
            <div>Profile</div>
            <Link className="btn btn-danger w-25" to='/attendance'>Exit</Link>
        </>
    )
}

export default Profile;