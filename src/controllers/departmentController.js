import departmentServices from "../services/department/departmentServices";
import apiUtils from "../utils/apiUtils";


const getDepartments = async (req, res) => {
    try {
        if (req.query && req.query.page) {
            let page = +req.query.page;
            let limit = +req.query.limit;
            let data = await departmentServices.getDepartmentsWithPagination(page, limit, +req.query?.delay);
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
        } else {
            let data = await departmentServices.getAllDepartments();
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


    } catch (error) {
        console.log(error);
        return res.status(500).json(apiUtils.resFormat());
    }


}


const createANewDepartment = async (req, res) => {
    try {
        let data = await departmentServices.createANewDepartment(req.body)
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


const updateADepartment = async (req, res) => {
    try {
        let data = await departmentServices.updateADepartment(req.body);
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

const deleteADepartment = async (req, res) => {
    try {
        let data = await departmentServices.deleteADepartment(req.body);

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
    getDepartments, createANewDepartment, updateADepartment, deleteADepartment
}