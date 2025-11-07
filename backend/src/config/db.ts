import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv"

dotenv.config()

export const db = new Sequelize(process.env.DATABASE_URL,{
    models: [__dirname + "/../models/**/*"],
    /*
    define: {
        timestamps:false
    },*/
    logging:false,
    dialectOptions:{
        ssl: {
            require: false
        }
    }
})