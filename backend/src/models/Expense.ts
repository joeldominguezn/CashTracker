import { Table, DataType, Column, HasMany, BelongsTo, Model, ForeignKey, AllowNull } from "sequelize-typescript";
import Budget from "./Budget";

@Table({
    tableName:"Expenses"
})
class Expense extends Model {

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    declare name: string

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number


    @ForeignKey(()=>Budget)
    declare budgetId: number

    @BelongsTo(()=>Budget)
    declare budget: Budget
}
export default Expense