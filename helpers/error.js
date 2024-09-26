
exports.response_failed = async (res, status_code, status_message, error_message) => {
    const response = {
        success: false,
        message: status_message,
    };

    if (error_message !== undefined) {
        response.error = error_message;
    }

    if (status_code !== undefined) {
        return res.status(status_code).json(response);
    }
    return res.json(response);
}

exports.response_ok = async (res, status_code, status_message, status_user) => {
    const response = {
        success: true,
        message: status_message,
    };

    if (status_user !== undefined) {
        response.user = status_user;
        res.status(status_code).json(response);
        return response
    }
    return res.status(status_code).json(response);
}