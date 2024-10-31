import { AllowNull, Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { v4 } from 'uuid';
import { Message } from "src/modules/messages/model";
import { MemberOfDialog } from "src/modules/members-of-dialogs/model";

@Table
export class Dialog extends Model {
    @PrimaryKey
    @Default(v4)
    @Column(DataType.UUID)
    id: string

    @Column({ defaultValue: null, type: DataType.STRING })
    dialogName: string | null

    @Column({ defaultValue: null, type: DataType.STRING})
    dialogAvatar: string | null

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    isPrivate: boolean

    @HasMany(() => MemberOfDialog, { foreignKey: 'dialogId' })
    dialogIdMembersOfDialogs: MemberOfDialog[]

    @HasMany(() => Message, { foreignKey: 'dialogId' })
    dialogIdMessages: Message[]
}