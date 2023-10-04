import { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Tooltip } from 'antd';
import { request } from '../../share/request';
import { formatDateClient } from '../../share/helper';

const { Option } = Select;

const CustomerPageDash = () => {
    const [list, setList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [listProvince, setListProvince] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        getList();
    }, []);

    const onCancelModal = () => {
        setVisible(false);
    };

    const onFinish = (item) => {
        

    };

    const getList = () => {
        request('customer', 'get', {}).then((res) => {
            if (res) {
                console.log(res);
                setList(res.list);
                setListProvince(res.listProvince);
            }
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Customer Total: {list.length}</h3>
                <Button type="primary" onClick={() => setVisible(true)}>
                    New customer
                </Button>
            </div>

            <Table
                columns={[
                    {
                        key: 'no',
                        title: 'No',
                        render: (text, record, index) => index + 1,
                    },
                    {
                        key: 'firstname',
                        dataIndex: 'firstname',
                        title: 'Firstname',
                    },
                    {
                        key: 'lastname',
                        dataIndex: 'lastname',
                        title: 'Lastname',
                    },
                    {
                        key: 'gender',
                        dataIndex: 'gender',
                        title: 'Gender',
                    },
                    {
                        key: 'username',
                        dataIndex: 'username',
                        title: 'Username',
                    },
                    {
                        key: 'password',
                        dataIndex: 'password',
                        title: 'Password',
                        ellipsis: {
                            showTitle: false,
                        },
                        render: (password) => (
                            <Tooltip placement="topLeft" title={password}>
                                {password}
                            </Tooltip>
                        ),
                    },
                    {
                        key: 'address_des',
                        dataIndex: 'address_des',
                        title: 'Address Description',
                    },
                    {
                        key: 'is_active',
                        dataIndex: 'is_active',
                        title: 'Active',
                        render: (text) => (
                            <Tag color={text === 1 ? 'green' : 'red'} key="1">
                                {text === 1 ? 'Active' : 'Inactive'}
                            </Tag>
                        ),
                    },
                    {
                        key: 'create_at',
                        dataIndex: 'create_at',
                        title: 'Create At',
                        render: (text) => formatDateClient(text),
                    },
                    {
                        key: 'action',
                        title: 'Action',
                        render: (text, record) => (
                            <Space>
                                <Button type="primary">Edit</Button>
                                <Button danger>Delete</Button>
                            </Space>
                        ),
                    },
                ]}
                dataSource={list}
            />
            <Modal
                visible={visible}
                title="New Customer"
                onCancel={onCancelModal}
                width={800}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label="Firstname"
                                name="firstname"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please insert firstname',
                                    },
                                ]}
                            >
                                <Input placeholder="Firstname" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Lastname"
                                name="lastname"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please insert lastname',
                                    },
                                ]}
                            >
                                <Input placeholder="Lastname" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label="Gender"
                                name="gender"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please insert gender',
                                    },
                                ]}
                            >
                                <Input placeholder="Gender" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Province" name="province">
                                <Select placeholder="Province" allowClear>
                                    {listProvince?.map((item, index) => (
                                        <Option key={index} value={item.province_id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please insert username',
                                    },
                                ]}
                            >
                                <Input placeholder="Username" />
                            </Form.Item>
                            </Col>
                            <Col span={12}>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please insert password',
                                    },
                                ]}
                            >
                                <Input placeholder="Password" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Address Description" name="address_des" > 
                                <Input placeholder='address_des'></Input>
                    </Form.Item>
                    
                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button danger>Cancel</Button>
                            <Button onClick={() => form.resetFields()}>Clear</Button>
                            <Button htmlType="submit" type="primary">
                                Save
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CustomerPageDash;
