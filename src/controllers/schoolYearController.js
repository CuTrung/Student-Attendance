import schoolYearServices from "../services/schoolYear/schoolYearServices";
import apiUtils from "../utils/apiUtils";

const getAllSchoolYears = async (req, res) => {
    try {
        let data = await schoolYearServices.getAllSchoolYears();
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
    getAllSchoolYears
}