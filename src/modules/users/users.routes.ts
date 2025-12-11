import express from 'express';
import { userControllers } from './users.controller';
import auth from '../../middleware/auth';



const router = express.Router();



router.get("/" ,auth("admin"),userControllers.getAllUSers);

router.get("/:userId",userControllers.getSingleUser)

router.put("/:userId",userControllers.updateUser)

router.delete("/:userId",userControllers.deleteUser)

export const userRoutes =router;