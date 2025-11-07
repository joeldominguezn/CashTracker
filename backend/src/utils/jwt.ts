import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export const genJWT = (id: string) => {
    return jwt.sign({id},process.env.API_SECRET,{
        expiresIn:"30d"
    })
}
export const getUserJWT = (token: string) => {
    return jwt.verify(token,process.env.API_SECRET)
}
export const decJWT = (password: string) => {
    return jwt.decode(password)
}