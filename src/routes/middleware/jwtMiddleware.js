import jwtUtils from "../../utils/jwtUtils";
import apiUtils from "../../utils/apiUtils";

const nonSecurePaths = ['/login'];
const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(apiUtils.convertPathToUrl(req.path)))
        return next();

    if (req.cookies && req.cookies.jwt) {
        let token = req.cookies.jwt;
        let decoded = jwtUtils.verifyToken(token);
        if (decoded) {
            req.user = decoded;
            next();
        } else {
            return res.status(401).json({
                ...apiUtils.resFormat(-1, "Authenticated failed")
            })
        }
    } else {
        return res.status(401).json({
            ...apiUtils.resFormat(-1, "Authenticated failed")
        })
    }


}

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(apiUtils.convertPathToUrl(req.path)))
        return next();

    if (req.user) {
        console.log(">>> Check user", req.user);
        let urlsAccess = req.user.urls;
        let urlCurrent = apiUtils.convertPathToUrl(req.path, req.method);
        if (urlsAccess.some(url => url === urlCurrent)) {
            next();
        } else {
            return res.status(403).json({
                ...apiUtils.resFormat(-1, "You don't have permission to access this resources")
            })
        }
    } else {
        return res.status(403).json({
            ...apiUtils.resFormat(-1, "You don't have permission to access this resources")
        })
    }
}

export default {
    checkUserJWT, checkUserPermission
}