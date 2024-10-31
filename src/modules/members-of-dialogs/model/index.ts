import { v4 } from 'uuid'
import { AllowNull, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/modules/users/model";
import { Dialog } from 'src/modules/dialogs/model';

enum privileges {
    NONE = 'none',
    ADMIN = 'admin',
    OWNER = 'owner'
}

@Table({tableName: 'MembersOfDialogs'})
export class MemberOfDialog extends Model {
    @PrimaryKey
    @Default(v4)
    @Column(DataType.UUID)
    id: string

    @AllowNull(false)
    @Column({
        type: DataType.ENUM(...Object.values(privileges))
    })
    privilege: privileges

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId: string

    @ForeignKey(() => Dialog)
    @Column(DataType.UUID)
    dialogId: string
}