import jwt from "jsonwebtoken";
import db from "../models";
import ApplicationError from "../utils/applicationError";
export const checkAuthentication = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const isblacklisted = await db.tokenblacklist.findOne({where:{token:token}})
        if(isblacklisted) throw new ApplicationError("Please login");
        const tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await db.employees.findOne({where:{id:tokenData.user.id}})
        if(!user.verified) {
            res.status(401).json({message:"You must verify your account first."});
        }else{
            next();
        }
    }catch(error){
        res.status(401).json({message:"Authentication failed. Please login!",error});
    }
    
}