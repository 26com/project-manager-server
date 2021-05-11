const express = require('express');

const unprotected = require('./unprotected');
const workspace = require('./workspace');
const project = require('./project');

const router = express.Router();

router.use('/unprotected', unprotected.router);
router.use('/workspace', workspace.router);
router.use('/project', project.router);

module.exports = {
  router,
};
