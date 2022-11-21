import loginServices from "../services/both/loginServices";
import apiUtils from "../utils/apiUtils";


const login = async (req, res) => {
    try {
        let data = await loginServices.login(req.body);
        // set cookie
        res.cookie("jwt", data.DT.access_token, { httpOnly: true });

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
    login
}