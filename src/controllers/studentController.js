import studentServices from "../services/student/studentServices";
import apiUtils from '../utils/apiUtils';

const getStudents = async (req, res) => {
    try {
        if (req.query && req.query.page) {
            let page = +req.query.page;
            let limit = +req.query.limit;
            let data = await studentServices.getStudentsWithPagination(page, limit, +req.query?.delay);
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
            let data = await studentServices.getAllStudents();
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

const createANewStudent = async (req, res) => {
    try {
        let isExistEmail = await studentServices.getStudentByEmail(req.body.email);
        if (isExistEmail.DT) {
            return res.status(200).json(apiUtils.resFormat(1, "Email is exist, can't create"));
        }
        let data = await studentServices.createANewStudent(req.body);
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

const deleteAStudent = async (req, res) => {
    try {
        let data = await studentServices.deleteAStudent(req.body);
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

const updateAStudent = async (req, res) => {
    try {
        let isExistEmail = await studentServices.getStudentByEmail(req.body.email);
        if (isExistEmail.DT) {
            return res.status(200).json(apiUtils.resFormat(1, "Email is exist, can't update"));
        }

        let data = await studentServices.updateAStudent(req.body);
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
    getStudents, createANewStudent, deleteAStudent, updateAStudent
}