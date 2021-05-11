const express = require('express');

const { signIn } = require('../controllers/auth');
const {
  createNew, getByUser, getWorkspace, getByWorkspace, deleteOne,
} = require('../controllers/project');

const router = express.Router();

router.post('/', signIn, createNew);
router.get('/user', signIn, getByUser);
router.get('/workspace', signIn, getWorkspace, getByWorkspace);
router.delete('/', signIn, deleteOne);

module.exports = {
  router,
};
