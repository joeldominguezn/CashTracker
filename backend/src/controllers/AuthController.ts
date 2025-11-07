import { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { genToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmails"
import { decJWT, genJWT, getUserJWT } from "../utils/jwt"

export class AuthController {
    static create_account = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body
            const userExist = await User.findOne({where:{email}})
            if(userExist){
                const error = new Error("Ya esta registrado este correo")
                res.status(409).json({error:error.message})
                return
            }
            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.token = genToken()
            await user.save()

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })

            res.status(201).json("Cuenta Creada Correctamente")
        } catch (error) {
            console.log(`error al crear una cuenta: ${req.body.email}`)
            res.status(500).json({error: "Hubo un error de servidor"})
            return
        }
    }
    static confirm_account = async (req: Request, res: Response) => {
        const {token} = req.body
        const user = await User.findOne({where:{token}}) //No es unico el token asi que ojal
        if(!user)
        {
            const error = new Error("Token No Válido")
            res.status(401).json({error:error.message})
            return
        }
        user.confirmed = true
        user.token = null
        await user.save()
        res.json("Cuenta confirmada correctamente")
        return
    }
    static login_account = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({where:{email}})
            if(!user){
                const error = new Error("Usuario no encontrado")
                res.status(404).json({error:error.message})
                return
            }
            if(!user.confirmed)
            {
                const error = new Error("Usuario no confirmado")
                res.status(403).json({error:error.message})
                return
            }
            const isPasswordChecked = await checkPassword(password,user.password)
            if(!isPasswordChecked)
            {
                const error = new Error("Password Incorrecto")
                res.status(401).json({error:error.message})
                return
            }
            const jwt_token = genJWT(user.id)
            res.json(jwt_token)
        } catch (error) {
            console.log(`error al iniciar sesion de una cuenta: ${req.body.email}`)
            res.status(500).json({error: "Hubo un error de servidor"})
            return
        }
    }
    static change_password = async (req: Request, res: Response) => {
        return
    }
    static forgot_password = async (req: Request, res: Response) => {
        const {email} = req.body
        try {
            const user = await User.findOne({where:{email}})
            if(!user){
                const error = new Error("Usuario no encontrado")
                res.status(404).json({error:error.message})
                return
            }
            user.token = genToken()
            await user.save()

            await AuthEmail.sendPassResetEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })
            res.json("Revisa tu email para seguir las instrucciones")
        } catch (error) {
            res.status(500).json({error: "Hubo un error de servidor"})
            return
        }
    }
    static validate_token = async (req: Request, res: Response) => {
        const {token} = req.body
        try {
            const user = await User.findOne({where:{token}}) //No es unico el token asi que ojal
            if(!user)
            {
                const error = new Error("Token No Válido")
                res.status(401).json({error:error.message})
                return
            }
            res.json("Token Válido")
        } catch (error) {
            res.status(500).json({error: "Hubo un error de servidor"})
            return
        }
    }
    static reset_password_with_token = async (req: Request, res: Response) => {
        const {password} = req.body
        const {token} = req.params
        try {
            const user = await User.findOne({where:{token}}) //No es unico el token asi que ojal
            if(!user)
            {
                const error = new Error("Token No Válido")
                res.status(401).json({error:error.message})
                return
            }
            user.password = await hashPassword(password)
            user.token = null
            res.status(201).json("Contraseña Cambiada Correctamente")
        } catch (error) {
            console.log(`error al resetear la contraseña del token : ${req.params.token}`)
            res.status(500).json({error: "Hubo un error de servidor"})
            return
        }
    }
    static get_user = async (req: Request, res: Response) => {
        res.json(req.user)
    }
    static update_curr_password = async (req: Request, res: Response) => {
        const {password, new_password} = req.body
        try {
            const user = await User.findByPk(req.user.id)
            const decPass = await checkPassword(password,user.password)
            if(!decPass)
            {
                const error = new Error("Contraseña incorrecta")
                res.status(401).json({error:error.message})
                return
            }
            user.password = await hashPassword(new_password)
            user.save()
            res.json("Contraseña cambiada correctamente")
            return
        } catch (error) {
            console.log(`error al cambiar la contraseña del token : ${req.params.token}`)
            res.status(500).json({error: "Hubo un error de servidor"})
            return
        }
    }
    static check_password = async (req: Request, res: Response) => {
        const {password} = req.body
        try {
            const user = await User.findByPk(req.user.id)
            const decPass = await checkPassword(password,user.password)
            if(!decPass)
            {
                const error = new Error("Contraseña incorrecta")
                res.status(401).json({error:error.message})
                return
            }
            res.json("Contraseña ingresada correctamente")
            return
        }catch (error){
            console.log(`error al checkear la contraseña del token : ${req.params.token}`)
            res.status(500).json({error: "Hubo un error de servidor"})
            return
        }
    }
    static updateUser = async (req: Request, res: Response) => {
        const {email, name} = req.body
        try {
            //actualiza el correo
            const userExist = await User.findOne({where:{email}})
            if(userExist && userExist.id !== req.user.id){
                const error = new Error("Ya esta registrado este correo")
                res.status(409).json({error:error.message})
                return
            }
            await User.update({email,name},{
                where: {
                    id: req.user.id
                }
            })
            res.json("Perfil Actualizado Correctamente, Revisa el nuevo correo para confirmar la cuenta")
            return
        } catch (error) {
            console.log(`error al actualizar el perfil`)
            res.status(500).json({error: "Hubo un error de servidor"})
            return
        }
    }
}
