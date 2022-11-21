import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";

// const getAllClassGroups = async () => {
//     try {
//         let data = await db.Major.findAll({
//             where: { isClosed: 0 },
//             attributes: ['id', 'name', 'description'],
//             raw: true,
//         })

//         return apiUtils.resFormat(0, "Get all Major successful !", data);
//     } catch (error) {
//         console.log(error);
//         return apiUtils.resFormat();
//     }
// }



const getClassGroupBySubjectId = async (subjectId) => {
    try {
        let data = await db.ClassGroup.findAll({
            where: {
                [Op.and]: [
                    { isClosed: 0 },
                    { subjectId },
                ]
            },
            attributes: ['id', 'name'],
            raw: true,
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get ClassGroup by subjectId successful !", data);

        return apiUtils.resFormat(1, "Get ClassGroup by subjectId failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

export default {
    // getAllClassGroups,
    getClassGroupBySubjectId
}