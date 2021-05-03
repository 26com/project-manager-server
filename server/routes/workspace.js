const express = require('express');

const { signIn } = require('../controllers/auth');
const { createNew, getByUser } = require('../controllers/workspace');

const router = express.Router();

router.post('/', signIn, createNew);
router.get('/', signIn, getByUser);

module.exports = {
    router
};