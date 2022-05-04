const express = require('express')
const router = express.Router()

const { userController } = require('../controllers')
const { authMiddleware } = require('../middlewares')

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// employee routes
router.get('/user', userController.getemployeedata,)
router.put('/updateEmployeeDetail/:userId', authMiddleware, userController.updateEmployee)
router.delete('/employee/:userId', authMiddleware, userController.deleteEmployee)



module.exports = router;