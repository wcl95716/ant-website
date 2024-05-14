import { IWorkItem } from '@/models/workOrder/index.type';
import type { ProColumns } from '@ant-design/pro-components';
import moment from 'moment';

export const columns: ProColumns<IWorkItem>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '标题',
        dataIndex: 'title',
        copyable: true,
        ellipsis: true,
        tooltip: '标题过长会自动收缩',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
    },
    {
        disable: true,
        title: '状态',
        dataIndex: 'state',
        filters: true,
        onFilter: true,
        ellipsis: true,
        valueType: 'select',
        valueEnum: {
            all: { text: '超长'.repeat(50) },
            open: {
                text: '未解决',
                status: 'Error',
            },
            closed: {
                text: '已解决',
                status: 'Success',
                disabled: true,
            },
            processing: {
                text: '解决中',
                status: 'Processing',
            },
        },
    },
    {
        title: '创建时间',
        key: 'showTime',
        dataIndex: 'created_at',
        // valueType: 'date',
        // 定义显示的日期时间格式
        valueType: 'dateTime',
        render: (_, record) => {
            // 使用 moment 库来格式化日期时间
            return moment(record.created_at).format('YYYY-MM-DD HH:mm:ss');
        },
        sorter: true,
        hideInSearch: true,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateRange',
        hideInTable: true,
        search: {
            transform: (value) => {
                return {
                    startTime: value[0],
                    endTime: value[1],
                };
            },
        },
    },
    {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    action?.startEditable?.(record.id);
                    console.log('record ', record);
                }}
            >
                编辑
            </a>,
        ],
    },
];
