module.exports = (req, res, next) => {
    const err = {status: false, statusCode: 404, message: "Path Not Found" }
    next(err)
}