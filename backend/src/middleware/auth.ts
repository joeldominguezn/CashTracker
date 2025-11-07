import { NextFunction, Request, Response } from "express";
import { getUserJWT } from "../utils/jwt";
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization)
    {
        const error = new Error("No autorizado")
        res.status(401).json({error:error.message})
        return
    }
    const [_,token] = req.headers.authorization.split(" ")
    if(!token)
    {
        const error = new Error("No autorizado")
        res.status(401).json({error:error.message})
        return
    }
    try {
        const checkToken = getUserJWT(token)
        if(typeof checkToken === 'object' && checkToken.id)
        {
            const user = await User.findByPk(checkToken.id,{
                attributes: ["id","name","email"]
            })
            if(!user)
            {
                const error = new Error("Usuario no encontrado")
                res.status(401).json({error:error.message})
                return
            }
            req.user = user
            next()
            return
        }
        const error = new Error("Usuario no encontrado")
        res.status(401).json({error:error.message})
        return
    } catch (error) {
        console.log(error)
        console.log(`error al obtener el usuario : ${req.body}`)
        res.status(500).json({error: "Hubo un error de servidor"})
        return
    }
}