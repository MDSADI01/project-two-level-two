import { Router } from 'express';
import  express  from 'express';
import { vehiclesControllers } from './vehicles.controllers';
import auth from '../../middleware/auth';


const router = express.Router();


router.post("/", auth("admin"),vehiclesControllers.createVehicle);

router.get("/", vehiclesControllers.getAllVehicles)

router.get("/:vehicleId" , vehiclesControllers.getSingleVehicle)

router.put("/:vehicleId" ,auth("admin"), vehiclesControllers.updateVehicle)

router.delete("/:vehicleId" ,auth("admin"), vehiclesControllers.deleteVehicle)


export const vehiclesRoutes = router;