import specialStudentsServices from "../services/specialStudents/specialStudentsServices";
import apiUtils from "../utils/apiUtils";
import classGroupServices from "../services/classGroup/classGroupServices";

const getSpecialStudentsByClassGroupId = async (req, res) => {
    try {

        // Inactive classGroup (Make students can't continue attendance)
        let dataTimeline = await classGroupServices.updateTimelineOrActiveAClassGroup(req.body);
        if (dataTimeline.EC === 0) {
            let data = await specialStudentsServices.getSpecialStudentsByClassGroupId(req.body.id);
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
        }

        return res.status(500).json(apiUtils.resFormat());
    } catch (error) {
        console.log(error);
        return res.status(500).json(apiUtils.resFormat());
    }
}


export default {
    getSpecialStudentsByClassGroupId
}