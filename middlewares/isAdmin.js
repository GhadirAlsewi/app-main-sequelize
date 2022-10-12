const isAdmin = function(req, res, next) {
    console.log("Hello from isAdmin middlewares")
    // res.send("Hello")
    if (req.user){
        if (req.user.type == 'admin') {
            return next()
        }
    }
    res.status(403)
    res.send({
        success: false,
        messages: ["You do not have permission to perform this request"]
    })
}

module.exports = isAdmin