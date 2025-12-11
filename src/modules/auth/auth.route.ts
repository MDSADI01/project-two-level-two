import { Router } from "express";
import { authController } from "./auth.controller";
import { userControllers } from "../users/users.controller";

const router = Router();

router.post("/signup",userControllers.createUser)
router.post("/signin",authController.loginUser)

export const authRoutes = router;

