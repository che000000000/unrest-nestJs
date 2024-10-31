import { Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/modules/users/model";
import { v4 } from 'uuid'

@Table
export class Subscribe extends Model {
    @PrimaryKey
    @Default(v4)
    @Column(DataType.UUID)
    id: string

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    ownerId: string

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId: string
}