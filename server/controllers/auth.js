import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';

import configs from '../config/index.js';
import User from '../models/user.js';
import sendMail from '../utils/sendMail.js';

export const register = async function(req, res, next){
    try{

        const candidate = await User.findOne({
            where: {
                [Sequelize.Op.and]: [
                    {email: req.body.email},
                    {confirm: true}
                ]
            }
        });

        if(candidate){
            //email is busy
            res.status(409).json({
                message: 'Email is busy'
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password,
            confirm: false
        });

        const tokenReg = jwt.sign({
            email: req.body.email,
            id: user.dataValues.id
        }, configs.secretKey, {expiresIn: '5m'});


        await sendMail(req.body.email, tokenReg);

        res.status(200).json({
            massege: `Mail was sent to ${req.body.email}`
        });

    }
    catch(err){
        err.message = 'User were not created';
        next(err);
    }
};

export const registerGapi = async function(req, res, next){

    try{

        const candidate = await User.findOne({
            where: {
                [Sequelize.Op.and]: [
                    {email: req.body.email},
                    {confirm: true}
                ]
            }
        });

        req._email = req.body.email;

        if(!!candidate){
            req._id = candidate.dataValues.id;
            next();
            return;
        }

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            confirm: true
        });

        req._id = user.dataValues.id;
        next();
        return;

    }
    catch(err){
        err.message = 'User were not created';
        next(err);
    }
};

export const login = async function(req, res, next){

    req._email = req.body.email ? req.body.email : req._email;

    try{

        const candidate = await User.findOne({
            where: {
                [Sequelize.Op.and]: [
                    {email: req.body.email},
                    {confirm: true}
                ]
            }
        });

        if(candidate){

            //if(!req._check_token){
                const passwordResult = bcrypt.compareSync(req.body.password, candidate.dataValues.password);
                if(passwordResult){
                    req._id = candidate.dataValues.id;
                    req._name = candidate.dataValues.name;
                    next();
                    return;
                };
            //};

            if(req._check_token){

                req._id = candidate.dataValues.id;
                req._name = candidate.dataValues.name;
                next();
                return;

            }
            else{
                res.status(401).json({
                    message: 'invalid password'
                });
            }
        }
            
        else{
            res.status(401).json({
                message: 'User not found'
            });
        }
    }
    catch(err){
        err.message = 'The user is not login.'
        next(err);
    }
};

export const checkRegisterToken = async function(req, res, next){

    try{

        const token = req.query.token;

        jwt.verify(token, configs.secretKey, (err, decoded)=>{

            if(err){
                console.log(err);
                res.status(401).json({
                    message: 'Wrong token'
                });
                return;
            }; 

            const id = decoded.id;

            User.update({confirm: true}, {where: {id}});

            req._id = id;
            next();
            return;

        });

    }
    catch(err){
        err.message('Wrong token');
        next(err);
    }
};

export const getToken = async function(req, res){

    try{

        const token = jwt.sign({
            email: req._email,
            id: req._id
        }, configs.secretKey, {expiresIn: '300h'});

        await User.update({token}, {where: {id: req._id}});

        res.status(200).json({
            token,
            userName: req._name,
            massege: 'log in'
        });

    }catch(err){

        err.message = 'Token not received.'

    }
};