import { transport } from "../config/nodemailer"

type EmailType = {
    email: string,
    name: string,
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: "CashTrackr <admin@ctrackr.com>",
            to: user.email,
            subject: "CashTrackr - Confirma tu cuenta",
            html: `<p>Hola ${user.name} has creado tu cuenta en CashTrackr, ya esta casi lista</p>
                <p>Visita el siguiente enlace</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>Ingresa el código: <b>${user.token}</b></p>`
        })
        return email
    }
    static sendPassResetEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: "CashTrackr <admin@ctrackr.com>",
            to: user.email,
            subject: "CashTrackr - Restablecer Contraseña",
            html: `<p>Hola ${user.name} has solicitado restablecer tu contraseña en CashTrackr</p>
                <p>Visita el siguiente enlace</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Contraseña</a>
                <p>Ingresa el código: <b>${user.token}</b></p>`
        })
    }
}