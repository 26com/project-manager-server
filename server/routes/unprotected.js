import express from 'express';

import { login, getRegisterToken, register, registerGapi, getToken, checkRegisterToken } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login, getToken);
router.post('/emailCheck', getRegisterToken);
router.get('/emailCheck', checkRegisterToken);
router.post('/register', register, getToken);
router.post('/registerGapi', registerGapi, getToken);

export default router;