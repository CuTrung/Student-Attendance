import { v4 as uuidv4 } from 'uuid';

const random = (length) => {
    // let uuid = uuidv4();
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }


    return result;


    // Có thể có sự trùng lặp về showCode, improve với uuid
    // return {
    //     showCode: result,
    //     uuid
    // };
}



export default {
    random
}