// const { token } = require("morgan")

const authSrevice = require("../services/authService")

const isAuthenticated = function (req, res, next) {
    var auth = req.headers.authorization
    if(auth) {
        var token = auth.split(' ')
        // Array.isArray(token)
        if (token.length == 2) {
            var payload = authSrevice.decryptToken(token[1])
            if (payload) {
                req.user = payload
                return next()
            }
        }
    }
    res.status(401)
    res.send({
        success: false,
        messages: ['Please login first']
    })
}

module.exports = isAuthenticated