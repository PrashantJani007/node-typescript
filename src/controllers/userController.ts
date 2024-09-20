import { RequestHandler } from "express";
import { User } from "../models/user";
import userValidation from "../validations/userValidation";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { addTokenToBlacklist } from "../utils/tokenBlacklist";

export const signup: RequestHandler = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        const result = userValidation(req.body);
        if (result.error) {
            return res
            .status(422)
            .json({ status: false, code: 422, message: result.error.message });
        }
        const checkEmail = await User.findOne({ where: { email } });
        if (checkEmail != undefined) {
            return res
            .status(422)
            .json({ status: false, code: 422, message: "Email already exists!" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        req.body.password = hashPassword;
        const user = await User.create(req.body); 
        return res.status(201).json({status:true,code:201,message:"User register successfully!"});
    } catch (error:any) {
        return res.status(400).json({status:false,code:400,message:error.message})        
    }
};

export const login:RequestHandler = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const getUser = await User.findOne({where:{email:email},attributes:['id','email','password']});
        if(!getUser){
            return res.status(400).json({status:false,message:"Please enter correct credentials!"});
        }
        const validatePassword = await bcrypt.compare(password,getUser.password);
        if(!validatePassword) return res.status(400).json({status:false,message:"Please enter correct credentials!"});
        const token  = jwt.sign({id:getUser.id},"SECRET",{expiresIn:'30m'});
        const refreshToken = jwt.sign({id:getUser.id},"REFRESHTOKEN",{expiresIn:'30d'})
        const userData = await User.findOne({where:{id:getUser.id},attributes: { exclude: ['password'] }});
        return res.status(200).json({status:true,data:{userData,token,refreshToken},message:"Logged In"});
    } catch (error:any) {
        return res.status(400).json({status:false,code:400,message:error.message})        
    }
};

export const profileDetails:RequestHandler = async(req,res)=>{
    const getUserDetails = await User.findOne({where:{id:req.user_id},attributes:{exclude:['password']}});
    return res.status(200).json({data:getUserDetails});
};

export const logout: RequestHandler = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided!" });
        }

        // Add the token to the blacklist
        addTokenToBlacklist(token);

        return res.status(200).json({ status: true, message: "User logged out successfully." });
    } catch (error: any) {
        return res.status(500).json({ status: false, message: "Logout failed", error: error.message });
    }
};