const express = require('express');

const { login, register, registerGapi, getToken, checkRegisterToken } = require('../controllers/auth');

const router = express.Router();

router.post('/login', login, getToken);
router.get('/register', checkRegisterToken, getToken);
router.post('/register', register);
router.post('/registerGapi', registerGapi, getToken);

module.exports = {
    router
};