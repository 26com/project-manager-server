console.log('auth contr');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

require('../models');
const { configs } = require('../config');
const { User } = require('../models/user');
const { sendMail } = require('../utils/sendMail');

const signIn = async function (req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({
        message: 'Please log in.',
      });
      return;
    }

    const decoded = jwt.verify(token, configs.secretKey, (err, dec) => {
      if (err) {
        console.log(err);
        res.status(401).json({
          message: 'Wrong token',
        });
        return;
      }
      return dec;
    });

    console.log(decoded.id);

    const currentUser = await User.findOne({
      where: {
        id: decoded.id,
      },
    });

    const checkToken = token === currentUser.dataValues.token;

    if (!checkToken) {
      res.status(401).json({
        message: 'Wrong token. Please log in.',
      });
      return;
    }

    req._currentUser = currentUser;
    next();
    return;
  } catch (err) {
    err.message = 'Login error.';
    next(err);
  }
};
const register = async function (req, res, next) {
  try {
    const candidate = await User.findOne({
      where: {
        [Sequelize.Op.and]: [
          { email: req.body.email },
          { confirm: true },
        ],
      },
    });

    if (candidate) {
      // email is busy
      res.status(409).json({
        message: 'Email is busy',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password,
      confirm: false,
    });

    const tokenReg = jwt.sign({
      email: req.body.email,
      id: user.dataValues.id,
    }, configs.secretKey, { expiresIn: '5m' });

    await sendMail(req.body.email, tokenReg);

    res.status(200).json({
      massege: `Mail was sent to ${req.body.email}`,
    });
  } catch (err) {
    err.message = 'User were not created';
    next(err);
  }
};

const registerGapi = async function (req, res, next) {
  try {
    const candidate = await User.findOne({
      where: {
        [Sequelize.Op.and]: [
          { email: req.body.email },
          { confirm: true },
        ],
      },
    });

    req._email = req.body.email;

    if (candidate) {
      req._id = candidate.dataValues.id;
      next();
      return;
    }

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      confirm: true,
    });

    req._id = user.dataValues.id;
    console.log(user.dataValues.id);
    next();
    return;
  } catch (err) {
    err.message = 'User were not created';
    next(err);
  }
};

const login = async function (req, res, next) {
  req._email = req.body.email ? req.body.email : req._email;

  try {
    const candidate = await User.findOne({
      where: {
        [Sequelize.Op.and]: [
          { email: req.body.email },
          { confirm: true },
        ],
      },
    });

    if (candidate) {
      const passwordResult = bcrypt.compareSync(req.body.password, candidate.dataValues.password);
      if (passwordResult) {
        req._id = candidate.dataValues.id;
        req._name = candidate.dataValues.name;
        next();
        return;
      }

      if (req._check_token) {
        req._id = candidate.dataValues.id;
        req._name = candidate.dataValues.name;
        next();
        return;
      }

      res.status(401).json({
        message: 'invalid password',
      });
    } else {
      res.status(401).json({
        message: 'User not found',
      });
    }
  } catch (err) {
    err.message = 'The user is not login.';
    next(err);
  }
};

const checkRegisterToken = async function (req, res, next) {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, configs.secretKey, (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(401).json({
          message: 'Wrong token',
        });
        return;
      }

      return decoded;
    });

    if (!decoded) {
      return;
    }

    const { id } = decoded;

    User.update({ confirm: true }, { where: { id } });

    req._id = id;
    next();
    return;
  } catch (err) {
    err.message('Wrong token');
    next(err);
  }
};

const getToken = async function (req, res, next) {
  try {
    const token = jwt.sign({
      email: req._email,
      id: req._id,
    }, configs.secretKey, { expiresIn: '300h' });

    console.log(token);

    await User.update({ token }, { where: { id: req._id } });

    res.status(200).json({
      token,
      userName: req._name,
      massege: 'log in',
    });
  } catch (err) {
    err.message = 'Token not received.';
    next(err);
  }
};

module.exports = {
  signIn,
  register,
  registerGapi,
  login,
  checkRegisterToken,
  getToken,
};
