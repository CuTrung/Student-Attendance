import db from "../../models";
import apiUtils from "../../utils/apiUtils";

const getAllSchoolYears = async () => {
    try {
        let data = await db.SchoolYear.findAll({
            attributes: ['id', 'name', 'description'],
            raw: true,
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get all SchoolYear successful !", data);

        return apiUtils.resFormat(1, "Get all SchoolYear failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getAllSchoolYears
}