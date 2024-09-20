import { Router } from "express";
import { login, logout, signup } from "../controllers/userController";
import authUser from "../middlewares/auth";
const router = Router();

router.post('/signup',signup);
router.post('/signin',login);
router.post('/logout',authUser,logout);

export default router;