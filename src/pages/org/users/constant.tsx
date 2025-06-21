import { UserOutputType } from "@/services/user/api.type";
import { DeleteOutlined, DiffOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";


interface IProps {
    onOpenFormHandler: (clickOne: UserOutputType) => void;
    onDelHandler: (ids: string[]) => void;
    // onOpenDetailHanler: (clickOne: OutputType) => void;
    // onOpenResetPwdHanler: (clickOne: OutputType) => void;
}

export const listcolumns: ({
    onOpenFormHandler,
    onDelHandler,
    // onOpenDetailHanler,
    // onOpenResetPwdHanler,
}: IProps) => ColumnsType<UserOutputType> = ({
    onOpenFormHandler,
    onDelHandler,
    // onOpenDetailHanler,
    // onOpenResetPwdHanler,
}) => [
 {
        title: 'ID',
        dataIndex: 'id',
        width: 265,
        render: (val) => {
            return <Typography.Text ellipsis={{ tooltip: {val} }}>{val}</Typography.Text>
        }
    },
    {
        title: '姓名',
        dataIndex: 'name',
    },
     {
        title: '手机',
        dataIndex: 'phone',
    },
     {
        title: '邮箱',
        dataIndex: 'email',
    },
     {
        title: '是否激活',
        dataIndex: 'active',
    },
     {
        title: '创建时间',
        dataIndex: 'createdAt',
        render: (val) => {
            return val ? dayjs(val).format("YYYY-MM-DD hh:mm") : '--'
        }
    },
     {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 180,
        render: (_, record) => (
            <Space size="small">
                <Tooltip title="详情">
                    <Button
                        key="detail"
                        type="text"
                        icon={<DiffOutlined />}
                        // onClick={() => onOpenDetailHanler(record)}
                    />
                </Tooltip>
                <Tooltip title="编辑">
                    <Button
                        key="edit"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onOpenFormHandler(record)}
                    />
                </Tooltip>
                <Tooltip title="删除">
                    <Button
                        key="del"
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => onDelHandler([record.id!])}
                    />
                </Tooltip>
                {/* <Tooltip title="重置密码">
                    <Button
                        key="resetPwd"
                        type="text"
                        icon={<RedoOutlined />}
                        onClick={() => onOpenResetPwdHanler(record)}
                    />
                </Tooltip> */}
            </Space>
        ),
    },
]