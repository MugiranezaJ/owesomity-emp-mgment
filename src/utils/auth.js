import jwt from "jsonwebtoken";
import db from "../models";
require('dotenv').config();

const secret = process.env.TOKEN_SECRET;
export const verifyToken = async (token) => {
    const decoded = await jwt.verify(token, secret);
    return decoded;
};

export const generateToken = (payload, expiresIn = '7d') => {
    const token = jwt.sign({ ...payload }, secret, { expiresIn });
    return token;
};

export const checkToken = async (token) => {
    const tokenFound = await db.tokenblacklist.findOne({where:{token:token}});
    if(!tokenFound) return 0;
    return 1
}