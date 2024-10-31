import { Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Dialog } from "src/modules/dialogs/model";
import { User } from "src/modules/users/model";
import { v4 } from 'uuid'

@Table
export class Message extends Model {
    @PrimaryKey
    @Default(v4)
    @Column(DataType.UUID)
    id: string

    @Column(DataType.TEXT)
    textMessage: string

    @ForeignKey(() => Dialog)
    @Column(DataType.UUID)
    dialogId: string

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId: string
}