const { validator, jwt } = require('../utils')
const { systemConfig } = require('../configs')
const { UserModel } = require('../models')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
// const bcrypt = require("bcrypt");
const saltRounds = 10
const register = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
    }

    // Extract params
    const { name, age, email, password, department ,isDeleted} = requestBody; // Object destructing

    // Validation starts

    if (!validator.isValid(name)) {
      return res.status(400).send({ status: false, message: ' Name is required' })
    }

    if (!validator.isValid(age)) {
      return res.status(400).send({ status: false, message: 'age number is required' })
    }

    if (!validator.isValidNumber(age)) {
      return res.status(400).send({ status: false, message: 'age number should be a valid number' })
    }
    if (!validator.isValid(department)) {
      return res.status(400).send({ status: false, message: 'department is required' })
    }

    if (!validator.isValid(email)) {
      return res.status(400).send({ status: false, message: `Email is required` })
    }

    if (!validator.validateEmail(email)) {
      return res.status(400).send({ status: false, message: `Email should be a valid email address` })
    }

    if (!validator.isValid(password)) {
      return res.status(400).send({ status: false, message: `Password is required` })
    }

    if (!validator.isValidLength(password, 8, 15)) {
      return res.status(400).send({ status: false, message: `Password lenght must be between 8 to 15 char long` })
    }

    const isEmailAlreadyUsed = await UserModel.findOne({ email }); // {email: email} object shorthand property

    if (isEmailAlreadyUsed) {
      return res.status(400).send({ status: false, message: `${email} email address is already registered` })
    }
    // Validation ends


    // const encryptedPassword = await bcrypt.hash(password, saltRounds);

    // // now we set user password to hashed password
    // requestBody.password = await bcrypt.hash(password, encryptedPassword);




    const userData = {name, age, email, password,department ,isDeleted}
    const newUser = await UserModel.create(userData);

    return res.status(201).send({ status: true, message: `User created successfully`, data: newUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

const login = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
      return
    }

    // Extract params
    const { email, password } = requestBody;

    // Validation starts
    if (!validator.isValid(email)) {
      return res.status(400).send({ status: false, message: `Email is required` })
    }

    if (!validator.validateEmail(email)) {
      return res.status(400).send({ status: false, message: `Email should be a valid email address` })
    }

    if (!validator.isValid(password)) {
      return res.status(400).send({ status: false, message: `Password is required` })
    }
    // Validation ends

    const user = await UserModel.findOne({ email, password });

    if (!user) {
      return res.status(401).send({ status: false, message: `Invalid login credentials` });
    }
    // let user = await userModel.findOne({ email, password });
    // if (user) {

    //   const _id = user._id
    //   const name = user.name
    //   const password = user.password

    // const validPassword = await bcrypt.compare(password);

    // if (!validPassword) { return res.status(400).send({ status: false, message: " Invalid password" }); }
    const token = await jwt.createToken({ userId: user._id });

    return res.status(200).send({ status: true, message: `User login successfull`, data: { token } });
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}
const getemployeedata = async function (req, res) {

  try {
    const filterQuery = {}
    const queryParams = req.query;

    if (validator.isValidRequestBody(queryParams)) {
      const { userId, name, email } = queryParams;

      if (validator.isValid(userId) && validator.isValidObjectId(userId)) {
        filterQuery['userId'] = userId
      }
      if (validator.isValid(name)) {
        filterQuery['name'] = name.trim()
      }
      if (validator.isValid(email)) {
        filterQuery['email'] = email.trim()
      }
    }

    const employee_data = await UserModel.find(filterQuery).sort({ name: 1, email: 1 })

    if (Array.isArray(employee_data) && employee_data.length === 0) {
      return res.status(404).send({ status: false, message: 'No employee found' })
    }

    return res.status(200).send({ status: true, message: 'emloyee list', data: employee_data })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}



const updateEmployee = async function (req, res) {
  try {
    const userId = req.params.userId
    const requestBody = req.body

    if (!Object.keys(requestBody).length > 0) {
      return res.status(200).send({ status: true, message: 'No param received user details unmodified' })
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" })
    }
    // Extract parameters
    let { name, email, password, age, department } = req.body
    // Prepare update fields
    if (name) {
      user['name'] = name
    }
    if (department) {
      user['department'] = department
    }
    if (age) {
      user['age'] = age
    }
    if (email) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).send({ status: false, message: email + " is not a valid email address" })
      }
      user['email'] = email
    }

     if (password) {
      if (password.length < 8 || password.length > 16) {
        return res.status(400).send({ status: false, message: `Password lenght must be between 8 to 15 char long` })
      }

      // const encryptedPassword = await bcrypt.hash(password, saltRounds);

      // user['password'] = encryptedPassword
    }

    const updatedUser = await user.save()
    const strUserUpdate = JSON.stringify(updatedUser);
    const objUserUpdate = JSON.parse(strUserUpdate)

    delete (objUserUpdate.password)

    return res.status(200).send({ status: true, message: 'User profile updated', data: objUserUpdate })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}


const deleteEmployee = async (req, res) => {
  try {
    const userId = req.params.userId;
    // const tokenId = req.userId
    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: `${userId} is not a valid  id` })
    }
    // if (!(validator.isValidObjectId(tokenId))) {
    //   return res.status(400).send({ status: false, message: "Not a valid userId or tokenId" });;
    // }

    const employeefind = await UserModel.findOne({ _id: userId })
    if (!employeefind) {
      return res.status(404).send({ status: false, message: `employee Details not found with given userId` })
    }

    if (employeefind.isDeleted == true) {
      return res.status(404).send({ status: false, message: "This employee is already deleted" });
    }
   

    const deleteemployee = await UserModel.findOneAndUpdate({ _id: userId }, { isDeleted: true, deletedAt: new Date() })
    return res.status(200).send({ status: true, message: `employee deleted successfully`, data: deleteemployee })
  }
  catch (err) {
    return res.status(500).send({ message: err.message });
  }
}



module.exports = {
  register,
  login,
  getemployeedata,
  updateEmployee,
  deleteEmployee
}