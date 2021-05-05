const express = require('express');

const { signIn } = require('../controllers/auth');
const { createNew, getByUser, deleteOne } = require('../controllers/workspace');

const router = express.Router();

router.post('/', signIn, createNew);
router.get('/', signIn, getByUser);
router.delete('/', signIn, deleteOne);

module.exports = {
  router,
};
