import { useAppDispatch } from '@/models/store';
import { createWorkOrder, refresh } from '@/models/workOrder/index.model';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const WorkItemForm = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            dispatch(createWorkOrder(values)).then(() => {
                // 刷新表格数据
                dispatch(refresh());
            });

            form.resetFields();
            setVisible(false);
            // 处理成功或显示成功消息
        } catch (error) {
            console.error('创建工作项出错:', error);
            // 处理错误或显示错误消息
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={() => setVisible(true)}>
                新建工作项
            </Button>
            <Modal
                visible={visible}
                title="创建工作项"
                okText="创建"
                cancelText="取消"
                onCancel={handleCancel}
                onOk={handleSubmit}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: '请输入标题' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="类型">
                        <Select>
                            <Option value={1}>类型1</Option>
                            <Option value={2}>类型2</Option>
                            <Option value={3}>类型3</Option>
                        </Select>
                    </Form.Item>
                    {/* 可以添加更多的 Form.Item 来处理其他字段 */}
                </Form>
            </Modal>
        </div>
    );
};

export default WorkItemForm;
