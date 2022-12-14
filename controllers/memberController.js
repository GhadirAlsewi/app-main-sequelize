var bcrypt = require('bcryptjs')
var models = require('../models');
const authSrevice = require('../services/authService');
// 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
var store = async function (req, res, next) {
    
    // function cryptPassword(plainTextPassword) {
    //     var salt = bcrypt.genSaltSync(10);
    //     var hash = bcrypt.hashSync(plainTextPassword, salt);
    //     return hash
    // }
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var name = req.body.name.trim()
    var email = req.body.email.trim()
    var phone = req.body.phone.trim()
    var gender = req.body.gender
    var password = req.body.password.trim()
    if (name.length < 3) {
        result.success = false
        result.messages.push('Please check your name')
    }
    if (email.length < 3) {
        result.success = false
        result.messages.push('Please check your email')
    }
    if (phone.length < 3) {
        result.success = false
        result.messages.push('Please check your phone')
    }
    if (password.length < 3) {
        result.success = false
        result.messages.push('Please check your password')
    }
    if (gender != '0' && gender != '1') {
        result.success = false
        result.messages.push('Please check your gender')
    }
    if (!result.success) {
        res.send(result)
        return
    }

    var tripPhotos = []

    if(req.files.length) {
        for (var i = 0; i < req.files.length; i++){
            tripPhotos.push({
                file: req.files[i].filename
            })
        }
    }
    console.log(tripPhotos)

    // password = cryptPassword(password)
    password = authSrevice.encryptPassword(password)
    var [newMember, created] = await models.Member.findOrCreate({
        where: {
            email: email
        },
        defaults: {
            name: name,
            email: email,
            phone: phone,
            gender: gender,
            password: password,
            Photos: tripPhotos
        }
    }, {
        include: models.Photo
    })
    
    if(created){
        result.messages.push("Member has been created successfully")
    }else{
        result.success = false
        result.messages.push("You are already registered")
    }
    // var newMember = await models.Member.create({
    //     name: name,
    //     email: email,
    //     phone: phone,
    //     gender: gender,
    //     password: password
    // })
    result.data = newMember
    // result.messages.push('Member has been created successfully')
    res.send(result)
}
var show = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var id = req.params.id
    var member = await models.Member.findByPk(id, {
        include: [
            models.Trip
        ]
    })
    if (member) {
        result.data = member
    } else {
        res.status(404)
        result.success = false
        result.messages.push('Please provide a valid ID')
    }
    res.send(result)
}
var index = async function (req, res, next) {
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var members = await models.Member.findAll()
    if (Array.isArray(members)) {
        result.data = members
    } else {
        res.status(404)
        res.success = false
        res.messages.push('Please try again later')
    }
    res.send(result)
}

var destroy = async function (req, res, next) {
    console.log(req.headers.authorization)
    
    // token[1]
    
    console.log(payLoad)
    var result = {
        success: true,
        data: {},
        messages: []
    }
    var id = req.params.id
    var token = req.headers.authorization.split(' ')
    var payLoad = authSrevice.decryptToken(token[1])

    // if (payLoad.type == 'admin' || (payLoad.type == 'member' && payLoad.id == id)) {
    var deleted = await models.Member.destroy({
        where: {
            id: id
        }
    });
    if (deleted) {
        // result.data = member
        result.messages.push('Member has been deleted')
        res.status(200)
    } else {
        res.status(404)
        result.success = false
        result.messages.push('Please provide a valid ID')
    }
    // } else {
    //     // result : data
    //     result.success = false
    //     res.status(403)
    //     result.messages.push('You are not allowed to do so')
    // }
    res.send(result)
}

var update = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {}
    }
    var name = req.body.name.trim()
    var email = req.body.email.trim()
    var phone = req.body.phone.trim()
    var gender = req.body.gender
    var password = req.body.password.trim()
    if (name.length < 3) {
        result.success = false
        result.messages.push('Please check your name')
    }
    if (email.length < 3) {
        result.success = false
        result.messages.push('Please check your email')
    }
    if (phone.length < 3) {
        result.success = false
        result.messages.push('Please check your phone')
    }
    if (password.length < 3) {
        result.success = false
        result.messages.push('Please check your password')
    }
    if (gender != '0' && gender != '1') {
        result.success = false
        result.messages.push('Please check your gender')
    }
    if (!result.success) {
        res.send(result)
        return
    }
    var id = req.params.id
    var updatedMember = await models.Member.update({
        name: name,
        email: email,
        phone: phone,
        gender: gender,
        password: password
    }, {
        where: {
            id
        }
    })
    result.data = updatedMember
    result.messages.push('Member has been updated successfully')
    res.send(result)
}

var login = async function (req, res, next) {
    var result = {
        success: true,
        messages: [],
        data: {},
        token: null
    }

    var email = req.body.email.trim()
    var password = req.body.password.trim()
    var loggedMember = await models.Member.findOne({
        where: {
            email: email,
        }
    }).then((user) => {
        if (!user) {
            return false
        } else {
            // let passwordMatch = bcrypt.compareSync(password, user.password)
            // let passwordMatch = authSrevice.comparePassword(password, user.password)
            if (authSrevice.comparePassword(password, user.password)) {
                return user
            } else {
                return false
            }
        }
    })
    if (loggedMember) {
        result.data = loggedMember
        result.token = authSrevice.generateToken(loggedMember.id, 'member')
    } else {
        result.success = false
        result.messages.push('Wrong email or password')
    }
    res.send(result)
}

module.exports = {
    store,
    show,
    index,
    destroy,
    update,
    login
}