import express from 'express';

import { login, register, registerGapi, getToken, checkRegisterToken } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login, getToken);
//router.post('/emailCheck', getRegisterToken);
router.get('/register', checkRegisterToken, getToken);
router.post('/register', register);
router.post('/registerGapi', registerGapi, getToken);

export default router;