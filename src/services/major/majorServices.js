import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";

const getAllMajors = async () => {
    try {
        let data = await db.Major.findAll({
            where: { isClosed: 0 },
            attributes: ['id', 'name', 'description'],
            raw: true,
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get all Major successful !", data);

        return apiUtils.resFormat(1, "Get all Major failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getMajorsById = async (majorId) => {
    try {
        let data = await db.Major.findOne({
            where: {
                [Op.and]: [
                    { isClosed: 0 },
                    { id: majorId },
                ],
            },
            attributes: ['id', 'name', 'description'],
            raw: true,
        })

        if (data)
            return apiUtils.resFormat(0, "Get Major by Id successful !", data);

        return apiUtils.resFormat(1, "Not found Major by Id !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getAllMajors, getMajorsById
}