const User = require('../models/User')

function getUsers(req, res) {
    const docquery = User.find({});
    docquery
        .exec()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).send(error)
            return
        })
}

function postUser(req, res) {
    const { name, phoneNumber, email, kytNumber, passportNumber, country } = req.body
    const originalUser = {
        name,
        phoneNumber,
        email,
        kytNumber,
        passportNumber,
        country
    }
    const user = new User(originalUser)
    user.save(error => {
        if(checkServerError(res, error)) return;
        res.status(201).json(user)
        console.log('user created successfully')
    })
}

function checkServerError(res, error) {
    if(error) {
        res.status(500).send(error);
        return error;
    }
}

module.exports = { 
    getUsers,
    postUser
}