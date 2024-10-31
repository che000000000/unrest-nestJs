import { Model, Column, Table, PrimaryKey, Default, DataType, HasMany } from "sequelize-typescript";
import { Subscribe } from "src/modules/subscribes/model";
import { MemberOfDialog } from "src/modules/members-of-dialogs/model";
import { Message } from "src/modules/messages/model";
import { Thought } from "src/modules/thoughts/model";
import { v4 } from 'uuid';

@Table
export class User extends Model {
    @PrimaryKey
    @Default(v4)
    @Column(DataType.UUID)
    id: string

    @Column(DataType.STRING)
    email: string

    @Column(DataType.STRING)
    userTag: string

    @Column(DataType.STRING)
    userName: string

    @Column({ defaultValue: null, type: DataType.STRING })
    avatar: string | null

    @Column({ defaultValue: null, type: DataType.STRING })
    aboutMe: string | null

    @Column({ defaultValue: false, type: DataType.BOOLEAN })
    isWallOpen: boolean

    @Column(DataType.STRING)
    password: string

    @HasMany(() => Thought, { foreignKey: 'creatorId' })
    creatorIdThoughts: Thought[]

    @HasMany(() => Thought, { foreignKey: 'userId' })
    userIdThoughts: Thought[]

    @HasMany(() => Subscribe, { foreignKey: 'ownerId' })
    ownerIdFollows: Subscribe[]

    @HasMany(() => Subscribe, { foreignKey: 'userId' })
    userIdFollows: Subscribe[]

    @HasMany(() => MemberOfDialog, { foreignKey: 'userId' })
    userIdMembersOfDialogs: MemberOfDialog[]

    @HasMany(() => Message, {foreignKey: 'userId'})
    userIdMessages: Message[]
}