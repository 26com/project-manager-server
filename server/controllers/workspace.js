console.log('workspace contr');

require('../models');

const createNew = async function (req, res, next) {
  try {
    const User = req._currentUser;

    await User.createWorkspace({
      name: req.body.name,
      description: req.body.description,
      background: req.body.background,
      createdat: new Date(),
    });

    res.status(200).json({
      massege: `Workspace ${req.body.name} was created`,
    });
  } catch (err) {
    err.message = 'Workspace were not created';
    next(err);
  }
};

const getByUser = async function (req, res, next) {
  try {
    const User = req._currentUser;

    const workspaces = await User.getWorkspaces({
      order: [
        ['id', 'DESC'],
      ],
    });

    res.status(200).json({
      data: workspaces,
    });
  } catch (err) {
    err.message = 'Workspaces were not geted';
    next(err);
  }
};

module.exports = {
  createNew,
  getByUser,
};
