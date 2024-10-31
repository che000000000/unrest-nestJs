import { Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/modules/users/model";
import { v4 } from 'uuid';

@Table
export class Thought extends Model {
    @PrimaryKey
    @Default(v4)
    @Column(DataType.UUID)
    id: string

    @Column(DataType.STRING)
    thoughtText: string

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    creatorId: string

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId: string
}