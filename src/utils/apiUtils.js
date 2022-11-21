const resFormat = (errorCode = -1, errorMessage, data = '') => {
    return {
        EC: errorCode,
        EM: errorMessage ?? 'Something wrongs on server...',
        DT: data
    }
}

const delay = async (time = 500) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })

}


export default {
    resFormat, delay
}