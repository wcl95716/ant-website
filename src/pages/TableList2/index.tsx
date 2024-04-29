import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown } from 'antd';
import { useRef } from 'react';
import request from 'umi-request';
import { GithubIssueItem } from './index.type';
export const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
};

const handleSave = async (key: React.Key | React.Key[], record: GithubIssueItem) => {
    try {
        // 发送数据到后端保存
        await request.put(`http://0.0.0.0:25432/work_order`, {
            data: record,
        });
        console.log('保存成功:', key, record);
        // 刷新表格数据
        // actionRef.current?.reload();
    } catch (error) {
        console.error('保存失败:', error);
    }
};

const columns: ProColumns<GithubIssueItem>[] = [
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
        valueType: 'date',
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
            <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
                查看
            </a>,
            <TableDropdown
                key="actionGroup"
                onSelect={() => action?.reload()}
                menus={[
                    { key: 'copy', name: '复制' },
                    { key: 'delete', name: '删除' },
                ]}
            />,
        ],
    },
];

export default () => {
    const actionRef = useRef<ActionType>();
    return (
        <ProTable<GithubIssueItem>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                const mergedParams = {
                    ...params,
                    ...sort,
                    ...filter,
                };
                console.log('asdad ', mergedParams);
                await waitTime(2000);
                return request<{
                    data: GithubIssueItem[];
                }>('http://0.0.0.0:25432/work_order', {
                    params: { ...params, ...sort, ...filter },
                });
            }}
            editable={{
                type: 'multiple',
                onSave: handleSave,
            }}
            columnsState={{
                persistenceKey: 'pro-table-singe-demos',
                persistenceType: 'localStorage',
                defaultValue: {
                    option: { fixed: 'right', disable: true },
                },
                onChange(value) {
                    console.log('value: ', value);
                },
            }}
            rowKey="id"
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            form={{
                // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                syncToUrl: (values, type) => {
                    if (type === 'get') {
                        return {
                            ...values,
                            created_at: [values.startTime, values.endTime],
                        };
                    }
                    return values;
                },
            }}
            pagination={{
                pageSize: 5,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="高级表格"
            toolBarRender={() => [
                <Button
                    key="button"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        actionRef.current?.reload();
                    }}
                    type="primary"
                >
                    新建
                </Button>,
                <Dropdown
                    key="menu"
                    menu={{
                        items: [
                            {
                                label: '1st item',
                                key: '1',
                            },
                            {
                                label: '2nd item',
                                key: '1',
                            },
                            {
                                label: '3rd item',
                                key: '1',
                            },
                        ],
                    }}
                >
                    <Button>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>,
            ]}
        />
    );
};
