// import jwt from "jsonwebtoken";
import bycrypt from "bcryptjs";
import { sendMail } from "../helper/sendMail";
import { checkToken, generateToken, verifyToken } from "../utils/auth";
import db from "../models";
import ApplicationError from "../utils/applicationError";
import BadRequestError from "../utils/BadRequestError";
import NotFoundError from "../utils/notFoundErorror";
require('dotenv').config();

export class Manager{
  static async signup(req,res,next) {  
    const dob = new Date(req.body.date_of_birth);
    const now = new Date();
    const isAbove18 = (now.getFullYear() - dob.getFullYear()) >= 18 ? true: false;
    if(!isAbove18) throw new BadRequestError("You must be 18 years and above to be registered.");

    const emailExist = await db.employees.findOne({where:{email: req.body.email}})
    if(emailExist){
       throw new BadRequestError('Email already Exist');
    }  
    
    const salt = await bycrypt.genSalt(Number(process.env.SALT));
    const hashpassword = await bycrypt.hash(req.body.password, salt)
    const manager = {
      name: req.body.name,
      national_id: req.body.national_id,
      code: req.body.code,
      phone_number: req.body.phone_number,
      email: req.body.email,
      date_of_birth: req.body.date_of_birth,
      status: req.body.status,
      position: req.body.position,
      verified: false,
      password: hashpassword,
      created_date: req.body.created_date
    };
    try{
      const user = await db.employees.create(manager);
      const payload = {
        user: {
          id: user.id
        }
      };
      const token = await generateToken(payload, 10000);
      const msgBody = "click the following link to verify your acount. http://127.0.0.1:" + (process.env.PORT || 4200) + "/v1/manager/verify/"+token
        sendMail(req.body.email, "Account verification", msgBody ).then( data => {
          res.status(200).json({
            message : "Registration successful. Check your email to verify your account.",
          })
        }).catch(err => {
          next(err);
      })
    } 
    catch(err){
      if(err.name == "SequelizeUniqueConstraintError"){
        throw new BadRequestError({message: err.errors[0].message})
      }else{
        next(err)
      }
    }
  }

  static verifyUser = async (req, res, next) => {
    try{
      const token = req.params.token;
      const tokenData = await verifyToken(token);
      const user = await db.employees.findOne({where:{id: tokenData.user.id}});
      const updated = await db.employees.update({verified: true}, {where: {id:tokenData.user.id}})
      res.status(200).json({message:"User verifie successfully", data:tokenData.user.id})
    }catch(err){
      next(err);
    }
  }

  static login = async (req, res, next) => {
    try{
      const userexists = await db.employees.findOne({ where: {email: req.body.email  } });
      if (!userexists) return res.status(401).json({message:'Username or password is wrong'});

      //check password
      const validPass = await bycrypt.compare(req.body.password, userexists.password);
      if(validPass){
        const payload = {
          user: {
            id: userexists.id,
            email: userexists.email,
            name: userexists.name
          }
        };
        const token = await generateToken(payload,10000);
        res.status(200).json({message:"Logged in successfully.", token})
        
      }else{
        throw new BadRequestError("Password is not correct.")
      }
    }catch(err){
      next(err);
    }
  }

  static resetPassword = async (req, res, next) => {
    try{
      const firstPassword = req.body.firstPassword;
      const secondPassword = req.body.secondPassword;
      if(firstPassword != secondPassword) throw new BadRequestError("Passwords does not much");

      const userexists = await db.employees.findOne({where:{email:req.body.email}})
      if(!userexists){
        throw new NotFoundError("No user associated with the provded email.");
      }

      const salt = await bycrypt.genSalt(Number(process.env.SALT));
      const password = await bycrypt.hash(req.body.firstPassword, salt);
      const payload = {
        user: {
          id: userexists.id,
          email: userexists.email,
          name: userexists.name,
          password
        }
      }
      
        const token = await generateToken(payload, 10000);
        const msgBody = "Click the following link to reset your password. http://127.0.0.1:" + (process.env.PORT || 4200) +"/v1/manager/change-password/" + token;
        sendMail(req.body.email, "Password reset", msgBody ).then( () => {
          res.status(200).json({message:"Check your email, We sent a link to reset password."})
        }).catch(err => {
          throw new ApplicationError("There was a problem sending password reset email...");
        })
    }catch(err){
        next(err);
    }
  }

  // Change password.
  static changePassword = async (req, res) => {
    try{
      const isBlacklisted = await checkToken(req.params.token);
      if(isBlacklisted) throw new  BadRequestError("Token arleady used. Please re-request for password reset.");

      const tokenData = await verifyToken(req.params.token);
      if (Date.now() >= tokenData.exp * 1000) {
          throw new BadRequestError("Your token has expired. Please re-request password reset.");
      }

      const isUpdated = await db.employees.update({password:tokenData.user.password}, {where:{id:tokenData.user.id}})
      
      if(isUpdated[0]){
        const tokenBlacklisted = await db.tokenblacklist.create({token:req.params.token});
        res.status(200).json({message:"Password reset successfully."});
      }else{
        res.status(304).json({message:"Password not reset."});
      }
    }catch(err){
      next(err);
    }
  }

  // logout
  static logout = async (req, res, next) => {
    try{
      if(!req.headers.authorization) throw new ApplicationError("You are logged out arleady", 401);
      const token = req.headers.authorization.split(" ")[1];
      const result = await db.tokenblacklist.create({token});
      res.status(200).json({message:"Logout successful"})
    }catch(err){
      next(err);
    }
  }
}
