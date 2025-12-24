import { NextFunction, Request, Response } from "express"
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";


declare global {
    namespace Express {
      interface Request {
        user?: JwtPayload & { userId: number; role: string };
      }
    }
  }

const auth = (...roles: string[]) =>{
    return (req: Request, res: Response, next : NextFunction)=>{
        try{
          const authHeader = req.headers.authorization;

          if(!authHeader){
            return res.status(401).json({
                success: false,
                message: "Authorization header missing",
            })
          }

          if(!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
              });
          }
          const token = authHeader.split(" ")[1];
          if (!token) {
            return res.status(401).json({
              success: false,
              message: "Token missing",
            });
          }
          

          const decoded = jwt.verify(
            token,
            config.jwtSecret as string
          ) as JwtPayload;
    
          req.user = {
            ...decoded,
            userId: decoded.id,
            role: decoded.role
          }
    
          
          if (roles.length && !roles.includes(decoded.role)) {
            return res.status(401).json({
              success: false,
              message: "Forbidden access",
            });
          }
    
          next();
        }
        catch(err : any){
            res.status(500).json({
                success: false,
                message : err.message
            })
        }
    }
}

export default auth;