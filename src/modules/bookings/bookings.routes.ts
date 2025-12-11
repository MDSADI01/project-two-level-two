import  express  from 'express';
import { bookingController } from './bookings.controller';
import auth from '../../middleware/auth';


const router = express.Router();

router.post("/",auth(), bookingController.createBooking);

router.get("/",auth(),bookingController.getAllBookings);

router.put("/:bookingId",auth(),bookingController.updateBooking);

export const bookingRoutes = router;