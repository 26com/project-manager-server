const express = require('express');

const unprotected = require('./unprotected');
const workspace = require('./workspace');

const router = express.Router();

router.use('/unprotected', unprotected.router);
router.use('/workspace', workspace.router);

module.exports = {
  router,
};
