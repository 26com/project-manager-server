import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import configs from '../config/index.js';
import User from '../models/user.js';
import sendMail from '../utils/sendMail.js';

export const register = async function(req, res, next){

    try{

        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(req.body.password, salt);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password
        });

        req._email = user.dataValues.email;
        req._userId = user.dataValues.id;
        next();
        return;

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
                email: req.body.email
            }
        });

        req._email = req.body.email;

        if(!!candidate){
            req._userId = candidate.dataValues.id;
            next();
            return;
        }
        else{

            const user = await User.create({
                name: req.body.name,
                email: req.body.email
            });

            req._userId = user.dataValues.id;
            next();
            return;
        }
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
                email: req._email
            }
        });

        if(candidate){

            //if(!req._check_token){
                const passwordResult = bcrypt.compareSync(req.body.password, candidate.dataValues.password);
                if(passwordResult){
                    req._userId = candidate.dataValues.id;
                    next();
                    return;
                };
            //};

            if(req._check_token){

                req._userId = candidate.dataValues.id;
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
                message: 'user not found'
            });
        }
    }
    catch(err){
        err.message = 'The user is not login.'
        next(err);
    }
};

export const getRegisterToken = async function(req, res){

    try{

        const candidateEmail = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if(candidateEmail){
            //email is busy
            res.status(409).json({
                message: 'Email is busy'
            });
            return;
        }

        const tokenReg = jwt.sign({
            email: req.body.email
        }, configs.secretKey, {expiresIn: '5m'});


        await sendMail(req.body.email, tokenReg);

        res.status(200).json({
            massege: `Mail was sent to ${req.body.email}`
        });

    }
    catch(err){
        err.message('tokenReg wasnt sent');
        next(err);
    }
};

export const checkRegisterToken = async function(req, res){

    try{

        const token = req.query.token;

        jwt.verify(token, configs.secretKey, async (err, decoded)=>{

            if(err){
                console.log(err);
                res.status(401).json({
                    message: 'Wrong token'
                });
                return;
            }; 

            res.status(200).json({
                email: decoded.email
            });

        });

    }
    catch(err){
        err.message('Wrong token');
        next(err);
    }
};

export const getToken = async function(req, res){

    console.log('get token');

    try{

        const token = jwt.sign({
            id: req._userId,
            email: req._email
        }, configs.secretKey, {expiresIn: '300h'});

        await User.update({token}, {where: {id: req._userId}});

        res.status(200).json({
            token,
            massege: 'log in'
        });

    }catch(err){

        err.message = 'Token not received.'

    }
};