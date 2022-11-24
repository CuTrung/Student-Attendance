import teacherServices from "../services/teacher/teacherServices";
import apiUtils from '../utils/apiUtils';

const getTeachers = async (req, res) => {
    try {
        if (req.query && req.query.page) {
            let page = +req.query.page;
            let limit = +req.query.limit;
            let data = await teacherServices.getTeachersWithPagination(page, limit, +req.query?.delay);
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
            let data = await teacherServices.getAllTeachers();
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

const createANewTeacher = async (req, res) => {
    try {
        let isExistEmail = await teacherServices.getTeacherByEmail(req.body.email);
        if (isExistEmail.DT) {
            return res.status(200).json(apiUtils.resFormat(1, "Email is exist, can't create"));
        }
        let data = await teacherServices.createANewTeacher(req.body);
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

const deleteATeacher = async (req, res) => {
    try {
        let data = await teacherServices.deleteATeacher(req.body.email);

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

const updateATeacher = async (req, res) => {
    try {
        let isExistEmail = await teacherServices.getTeacherByEmail(req.body.email);
        if (isExistEmail.DT) {
            return res.status(200).json(apiUtils.resFormat(1, "Email is exist, can't update"));
        }

        let data = await teacherServices.updateATeacher(req.body);
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

const getTeacherByEmail = async (req, res) => {
    try {
        let data = await teacherServices.getTeacherByEmail(req.body.email);
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
    getTeachers, createANewTeacher, deleteATeacher, updateATeacher,
    getTeacherByEmail
}