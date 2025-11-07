import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from "./routes/budgetRouter"
import authRouter from "./routes/authRouter"

export async function ConnectDB() {
    try {
        console.log(colors.blue("conectando a la base de datos...."))
        await db.authenticate()
        db.sync()
        console.log(colors.bgGreen.white.bold("conexion exitosa"))
    } catch (error) {
        console.log(colors.bgRed.white.bold("hubo un error al tratar conectar"))
    }
}

ConnectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use("/api/budgets", budgetRouter)
app.use("/api/auth", authRouter)

export default app