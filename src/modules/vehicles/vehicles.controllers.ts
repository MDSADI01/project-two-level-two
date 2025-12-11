import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const createVehicle = async(req: Request, res: Response)=>{
    try{
        const result = await vehiclesServices.createVehicle(req.body)
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
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



const getAllVehicles = async(req: Request , res: Response)=>{
       try{
              const result = await vehiclesServices.getAllVehicles();
              res.status(201).json({
                 success: true,
                 message: "Vehicles retrieved successfully",
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




 const getSingleVehicle = async(req:Request,res:Response)=>{
    
        try{
            const result = await vehiclesServices.getSingleVehicle(req.params.vehicleId as string);
            if(result.rows.length === 0){
                res.status(404).json({
                    success:false,
                    message : "Vehicle not found",
                })
            }
            else{
                res.status(200).json({
                    success : true,
                    message : "Vehicle retrieved successfully",
                    data : result.rows[0]
                })
            }
            
        }
        
        catch(err: any){
            res.status(500).json({
                success:false,
                message : err.message
            })
        }
    }



     const updateVehicle = async (req:Request,res:Response)=>{
    
            const {vehicle_name,type,registration_number,daily_rent_price,availability_status} = req.body;
            try{
               const result = await vehiclesServices.updateVehicle(vehicle_name,type,registration_number,daily_rent_price,availability_status, req.params.vehicleId!)
               if(result.rows.length === 0){
                res.status(404).json({
                    success:false,
                    message : "Vehicle not found",
                })
            }
            else{
                res.status(200).json({
                    success : true,
                    message : "Vehicle updated successfully",
                    data : result.rows[0]
                })
            }
            }
            catch(err : any){
                res.status(500).json({
                    success:false,
                    message : err.message
                })
            
            }
        }


         const deleteVehicle = async(req:Request,res:Response)=>{
                try{
                    const result = await vehiclesServices.deleteVehicle(req.params.vehicleId as string);
                    if(result.rowCount === 0){
                        res.status(404).json({
                            success:false,
                            message : "Vehicle not found",
                        })
                    }
                    else{
                        res.status(200).json({
                            success : true,
                            message : "Vehicle deleted successfully",
                            data : result.rows[0]
                        })
                    }
                    
                }
                
                catch(err: any){
                    res.status(500).json({
                        success:false,
                        message : err.message
                    })
                }
            }

export const vehiclesControllers = {
    createVehicle,getAllVehicles,getSingleVehicle,updateVehicle,deleteVehicle
}
