import db from "../../models";
import apiUtils from "../../utils/apiUtils";

const getRoleByGroupId = async (groupId) => {
    try {
        let groupWithRoles = await db.Group.findAll({
            where: { id: groupId },
            include: [
                {
                    model: db.Role,
                    attributes: ['url'],
                    through: { attributes: [] },
                }
            ],
            attributes: ['name'],
            raw: true,
            nest: true,
        })

        let urls = groupWithRoles.map((item) => {
            return item.Roles.url;
        })

        let data = {
            role: groupWithRoles[0].name,
            urls
        }

        if (groupWithRoles.length > 0)
            return apiUtils.resFormat(0, "Get roles by groupId successful !", data);

        return apiUtils.resFormat(1, "Get roles by groupId failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getRoleByGroupId
}