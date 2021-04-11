import express from 'express';

import { login, register, registerGapi, getToken } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login, getToken);
router.post('/register', register, getToken);
router.post('/registerGapi', registerGapi, getToken);

export default router;