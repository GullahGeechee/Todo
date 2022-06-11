const express = require('express')
const UserModel = require('../model/usersSchema')
// pulls out the two function we need from express validator
const {check, validationResult, body} = require('express-validator')
const bcrypt = require('bcrypt')
const 

// * Create a Router
const router = express.Router()

//* Create or Register a new User
router.post('/', [
    check('username', "Username is required from Middleware!").notEmpty(),
    check("email", "Please use a valid email! from middleware").isEmail(),
    check("password", "Please enter a password").notEmpty(),
    check("password", "Please enter a password with six or more characters").isLength({min: 6}),
] ,async (req, res) => {
    const userData = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.json(errors.array())
    }

    try {
        // checking if there is an user with this email in the db
        const userExist = await UserModel.findOne({email: userData.email})
        // if user exist we return!
        if (userExist) {
            return res.json({msg: "User already exist!"})
        }

        //* ==== Create New User
        // 1 Create the salt
        const SALT = await bcrypt.genSalt(10)
        // 2 use the salt to create a hash with the user's password
        const hashedPassword = await bcrypt.hash(userData.password, SALT)
        // 3 assign the hashed password to the userData
        userData.password = hashedPassword
        // Write the user to the db
        const user = await UserModel.create(userData)

        res.status(201).json(user)
        
    } catch (error) {
        console.log(error)
        res.status(400).json('Bad request!')
    }
})

module.exports = router