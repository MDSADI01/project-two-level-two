import { pool } from "../../config/db";


type User = {
  userId: number;
  role: "customer" | "admin";
};

type BookingAction = "cancelled" | "returned";

const createBooking = async(payload: Record<string,unknown>)=>{
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    
    const vId = Number(vehicle_id);
    const vehicleResult = await pool.query(
      `SELECT daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
      [vId]
    );
  
    if (vehicleResult.rows.length === 0) {
      throw new Error("Vehicle not found");
    }
  
    const vehicle = vehicleResult.rows[0];
  
    if ((vehicle.availability_status as string).toLowerCase() === "booked") {
        throw new Error("Vehicle is already booked");
      }
  
    const dailyPrice = Number(vehicle.daily_rent_price);
  
    const start = new Date(rent_start_date as string);
    const end = new Date(rent_end_date as string);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (days <= 0) {
      throw new Error("Invalid booking dates");
    }
  
    const total_price = days * dailyPrice;
  
    const bookingResult = await pool.query(
      `INSERT INTO booking(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, "active"]
    );
  

    await pool.query(
      `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
      [vehicle_id]
    );
  
    return bookingResult;
}


const getBooking = async(user: any)=>{
    if (user.role === "admin") {
        return await pool.query("SELECT * FROM booking");
    } else {
        return await pool.query(`SELECT * FROM booking WHERE customer_id = $1`, [user.id]);
    }
}




const updateBooking = async(
  bookingId: number,
  user: any,
  status?: "cancelled" | "returned"
) =>{
  const bookingResult = await pool.query("SELECT * FROM booking WHERE id = $1", [bookingId]);

if(bookingResult.rows.length === 0){
  throw new Error("Booking Not Found");
}

const booking = bookingResult.rows[0];
const today = new Date();

if(status === "cancelled"){
  if(user.role !== "customer"){
    throw new Error("Only customers can cancel bookings");
  }

  if(booking.customer_id !== user.userId){
    throw new Error("You can cancel only your own booking");
  }

  if(today >= new Date(booking.rent_start_date)){
    throw new Error("Cannot cancel after booking start date");
  }

  const updateBooking = await pool.query("UPDATE booking SET status='cancelled' WHERE id = $1 RETURNING *", [bookingId]);

  await pool.query("UPDATE vehicles SET availability_status='available' WHERE id = $1", [booking.vehicle_id]);

  return{
    message: "Booking cancelled successfully",
    data: updateBooking.rows[0]
  }


}

if(status === "returned"){
  if(user.role !== "admin"){
    throw new Error("Only admin can return bookings");
  }

  const updateBooking = await pool.query("UPDATE booking SET status='returned' WHERE id = $1 RETURNING *", [bookingId]);

  await pool.query("UPDATE vehicles SET availability_status='available' WHERE id = $1", [booking.vehicle_id]);

  return{
    message: "Booking returned successfully",
    data: updateBooking.rows[0]
  }


}



}
  
  

export const bookingsServices = {
    createBooking,
    getBooking,
    updateBooking
}
