import { Router } from "express";
import {profileDetails} from "../controllers/userController";
const router = Router();

router.get('/me',profileDetails);

export default router;