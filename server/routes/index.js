import express from 'express';

import unprotected from './unprotected.js';

const router = express.Router();

router.use('/unprotected', unprotected);

export default router;