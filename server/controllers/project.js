require('../models');
const { Project } = require('../models/project');

const createNew = async function (req, res, next) {
  try {
    const user = req._currentUser;

    const project = await Project.create({
      name: req.body.name,
      background: req.body.background,
      workspaceId: req.body.workspaceId,
      createdat: new Date(),
    });

    await user.addProject(project);

    res.status(200).json({
      massege: `Project ${req.body.name} was created`,
    });
  } catch (err) {
    err.message = 'Project were not created';
    next(err);
  }
};

const deleteOne = async function (req, res, next) {
  // console.log(req.query);

  // try {
  //   await Workspace.destroy({
  //     where: {
  //       id: req.query.id,
  //     },
  //   });

  //   res.status(200).json({
  //     massege: `Workspace ${req.body.name} was deleted`,
  //   });
  // } catch (err) {
  //   err.message = 'Workspace were not deleted';
  //   next(err);
  // }
};

const getByUser = async function (req, res, next) {
  try {
    const User = req._currentUser;

    const projects = await User.getProjects({
      order: [
        ['id', 'DESC'],
      ],
    });

    res.status(200).json({
      data: projects,
    });
  } catch (err) {
    err.message = 'Projects were not geted';
    next(err);
  }
};

const getByWorkspace = async function (req, res, next) {
  try {
    const Workspace = req._currentWorkspace;

    const projects = await Workspace.getProjects({
      order: [
        ['id', 'DESC'],
      ],
    });

    const workspace = req._currentWorkspace.name;

    res.status(200).json({
      data: projects,
      workspace,
    });
  } catch (err) {
    err.message = 'Projects were not geted';
    next(err);
  }
};

const getWorkspace = async function (req, res, next) {
  try {
    const { workspaceId } = req.query;
    const User = req._currentUser;

    const workspaces = await User.getWorkspaces({
      where: {
        id: workspaceId,
      },
    });

    const workspace = workspaces[0];

    req._currentWorkspace = workspace;
    next();
  } catch (err) {
    err.message = 'Workspace were not geted';
    next(err);
  }
};

module.exports = {
  createNew,
  getByUser,
  getWorkspace,
  getByWorkspace,
  deleteOne,
};
