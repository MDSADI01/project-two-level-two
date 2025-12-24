import { Request, Response } from "express"
import { bookingsServices } from "./bookings.services"

const createBooking = async(req: Request, res: Response)=>{
    try{
        const result = await bookingsServices.createBooking({
            ...req.body,
            customer_id: req.user?.userId
        })
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result.rows[0],
        })
    }
    catch(err: any){
        res.status(500).json({
            success:false,
            message: err.message
         })
          
    }
}

const getAllBookings = async(req: Request , res: Response)=>{
       try{

        const user = req.user;
        
              const result = await bookingsServices.getBooking(user);
              res.status(200).json({
                 success: true,
                 message: "Bookings retrieved successfully",
                 data : result.rows
              })
              
           }
           catch(err: any){
              res.status(500).json({
                 success:false,
                 message: err.message
              })
           }
}

const updateBooking = async(req: Request , res: Response)=>{
    try{
        const user = req.user;
        const bookingId = Number(req.params.bookingId);
            const {action} = req.body;

    const result = await bookingsServices.updateBooking(bookingId,user,action);
    res.status(200).json({
        success: true,
        message: `Booking ${action === "cancel" ? "cancelled" : "returned"} successfully`,
        data: result,
      }) 
    }
    catch(err: any){
        res.status(500).json({
            success:false,
            message: err.message
         })
    }
}



export const bookingController={
   createBooking,
   getAllBookings,
   updateBooking
}