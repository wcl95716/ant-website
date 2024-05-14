import { useAppDispatch, useAppSelector } from '@/models/store';
import { deleteWorkOrder, selectRefresh, updateWorkOrder } from '@/models/workOrder/index.model';
import { IWorkItem } from '@/models/workOrder/index.type';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useEffect, useRef } from 'react';
import request from 'umi-request';
import WorkItemForm from './components/WorkItemForm';
import { columns } from './config';
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

export default () => {
    const actionRef = useRef<ActionType>();
    // const dispatch = useAppDispatch();
    const refresh = useAppSelector(selectRefresh);
    const dispatch = useAppDispatch();
    const handleSave = async (key: React.Key | React.Key[], record: IWorkItem) => {
        dispatch(updateWorkOrder(record));
    };

    // 删除按钮
    const handleDelete = async (key: React.Key | React.Key[], record: IWorkItem) => {
        dispatch(deleteWorkOrder(record.id as unknown as string));
    };

    useEffect(() => {
        actionRef.current?.reload();
        console.log('actionRef: ', actionRef);
    }, [refresh]);

    return (
        <ProTable<IWorkItem>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                const mergedParams = {
                    ...params,
                    ...sort,
                    ...filter,
                };
                console.log('asdad ', sort, mergedParams);
                await waitTime(2000);
                return request<{
                    data: IWorkItem[];
                }>('http://0.0.0.0:25432/WorkOrderAPI', {
                    params: { ...params, ...sort, ...filter },
                });
            }}
            editable={{
                type: 'multiple',
                onSave: handleSave,
                onDelete: handleDelete,
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
            // eslint-disable-next-line no-sparse-arrays
            toolBarRender={() => [<WorkItemForm key="form" />]}
        />
    );
};
