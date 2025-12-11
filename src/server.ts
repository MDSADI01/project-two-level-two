import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/users.routes";
import { authRoutes } from "./modules/auth/auth.route";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";

const app = express()






app.use(express.json());

initDB();

app.get('/', (req: Request, res: Response)=> {
  res.send('Hello World!')
})



app.use("/api/v1/users" , userRoutes)

app.use("/api/v1/auth", authRoutes)

app.use("/api/v1/vehicles",vehiclesRoutes)

app.use("/api/v1/bookings",bookingRoutes)


app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})

