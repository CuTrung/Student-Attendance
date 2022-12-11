import attendanceDetailsServices from "../services/attendanceDetails/attendanceDetailsServices";
import apiUtils from "../utils/apiUtils";

const getAttendanceDetailsByClassGroupId = async (req, res) => {
    try {

        let data = await attendanceDetailsServices.getAttendanceDetailsByClassGroupId(req.query.id);
        if (data.EC === 0 || data.EC === 1) {
            return res.status(200).json({
                EC: data.EC,
                EM: data.EM,
                DT: data.DT
            })
        }

        return res.status(500).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json(apiUtils.resFormat());
    }
}

const createAttendanceDetails = async (req, res) => {
    try {
        let data = await attendanceDetailsServices.createAttendanceDetails(req.body);
        if (data.EC === 0 || data.EC === 1) {
            return res.status(200).json({
                EC: data.EC,
                EM: data.EM,
                DT: data.DT
            })
        }

        return res.status(500).json({
            EC: data.EC,
            EM: data.EM,
            DT: data.DT
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json(apiUtils.resFormat());
    }
}


export default {
    getAttendanceDetailsByClassGroupId, createAttendanceDetails
}