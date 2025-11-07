import nodemailer, {TransportOptions} from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const config = () => (
    {
        host: process.env.NODEMAILER_HOST,
        port: +process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD
        }
    }
)

// Looking to send emails in production? Check out our Email API/SMTP product!
export const transport = nodemailer.createTransport(config());
