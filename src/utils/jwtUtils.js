import jwt from 'jsonwebtoken';

const createToken = (data) => {
    let token;
    try {
        token = jwt.sign(data, process.env.SECRET_KEY, { noTimestamp: true });
    } catch (error) {
        console.log(error)
    }
    return token;
}

const verifyToken = (token) => {
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        console.log(error)
    }
    return decoded;
}


export default {
    createToken, verifyToken,
}