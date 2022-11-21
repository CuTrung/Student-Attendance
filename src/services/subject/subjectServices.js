import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";



const getSubjectByTeacherId = async (teacherId) => {
    try {
        let data = await db.Subject.findAll({
            where: {
                [Op.and]: [
                    { isClosed: 0 },
                    { teacherId },
                ]
            },
            attributes: ['id', 'name', 'description', 'majorId'],
            raw: true,
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get Subject by teacherId successful !", data);

        return apiUtils.resFormat(1, "Get Subject by teacherId failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getSubjectByTeacherId
}