import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";

const getAllRegistrationGroups = async () => {
    try {
        let data = await db.RegistrationGroup.findAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'name', 'description'],
            raw: true,
            nest: true
        })

        if (data.length > 0)
            return apiUtils.resFormat(0, "Get all registrationGroups successful !", data);

        return apiUtils.resFormat(1, "Get all registrationGroups failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getRegistrationGroupsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.RegistrationGroup.findAndCountAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'name', 'description', 'isClosed'],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            registrationGroups: rows
        }

        if (time)
            await apiUtils.delay(time);

        if (rows.length > 0)
            return apiUtils.resFormat(0, "Get registrationGroups with pagination successful !", data);

        return apiUtils.resFormat(1, "Get registrationGroups with pagination failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createANewRegistrationGroup = async (registrationGroup) => {
    try {
        await db.RegistrationGroup.create({
            name: registrationGroup.name,
            description: registrationGroup.description,
            isClosed: 0
        })

        return apiUtils.resFormat(0, "Create a new registrationGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateARegistrationGroup = async (registrationGroupUpdate) => {
    try {
        await db.RegistrationGroup.update({
            name: registrationGroupUpdate.name,
            description: registrationGroupUpdate.description,
        }, {
            where: {
                id: registrationGroupUpdate.id
            }
        })

        return apiUtils.resFormat(0, "Update a registrationGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const deleteARegistrationGroup = async (registrationGroup) => {
    try {
        if (registrationGroup.isClosed) {
            await db.RegistrationGroup.update({ isClosed: +registrationGroup.isClosed }, {
                where: {
                    id: registrationGroup.id
                }
            })

            return apiUtils.resFormat(0, `${+registrationGroup.isClosed === 0 ? 'Open' : 'Close'} a registrationGroup successful !`);
        }

        // Delete khỏi database
        // Trước khi xóa RegistrationGroup cần update registrationGroupId 
        // của toàn bộ major đang reference đến RegistrationGroup đó  
        await db.RegistrationGroup.destroy({
            where: {
                id: registrationGroup.id
            }
        })

        return apiUtils.resFormat(0, "Delete a registrationGroup successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

export default {
    getAllRegistrationGroups, getRegistrationGroupsWithPagination,
    createANewRegistrationGroup, updateARegistrationGroup,
    deleteARegistrationGroup
}