import React, { useEffect, useState } from 'react'
import { request } from '../../share/request'
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table, Tag, Tooltip, message

} from "antd"
import { formatDateClient } from '../../share/helper'
const { Option } = Select




function EmployeeDash() {
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const [list_province, setListProvince] = useState([])
  const [form] = Form.useForm();  
  const [employeeIdEdit,setEmployeeIdEdit] = useState(null)
  const [role_idlist,setRole_IdList] = useState([])
  const [totalRecord,setTotalRecord] = useState(0)
  const [objFilter,setObjFilter] = useState({
    page : 1,
    txtSearch: "",
    RoleIdSearch: null
  
})
const {page,txtSearch,RoleIdSearch} = objFilter


  useEffect(() => {
    getList(objFilter)
  }, [page])
const getList = (parameter={}) =>{
  var param = "?page="+(parameter.page || 1)
  param += "&txtSearch="+(parameter.txtSearch || "" )
  param += "&RoleIdSearch="+(parameter.RoleIdSearch)
  request("employee"+param, "get", {}).then(res => {
    console.log(res)
    if (res) {
      setList(res.list)
      setRole_IdList(res.role_idlist)
      
    }
  })
}
  function onEditRemove(item){
    request("employee/"+item.employee_id,"delete",{}).then(res=>{
      if(res){
        message.success(res.message)
        getList();
      }
    })
  }
  function onEditClick(item){
    setVisible(true)
    setEmployeeIdEdit(item.employee_id)
    form.setFieldsValue({
      firstname : item.firstname ,
      lastname: item.lastname,
      tel: item.tel,
      password:item.password,
      email:item.email,
      base_salary:item.base_salary,
      province:item.province,
      role_id:item.role_id,
      address:item.address
    })
  }
  function onFinish(item){
    if(employeeIdEdit==null){
      var param = {
        "firstname" : item.firstname ,
        "lastname": item.lastname,
        "tel": item.tel,
        "password":item.password,
        "email":item.email,
        "base_salary":item.base_salary,
        "province":item.province,
        "role_id":item.role_id,
        "address":item.address
      }
      request("employee","post",param).then(res=>{
        if(res){
          message.success(res.message)
          form.resetFields();
          setVisible(false);
          getList();
        }
      })
    }else{
      var param = {
        "employee_id": employeeIdEdit,
        "firstname" : item.firstname ,
        "lastname": item.lastname,
        "tel": item.tel,
        "password":item.password,
        "email":item.email,
        "base_salary":item.base_salary,
        "province":item.province,
        "role_id":item.role_id,
        "address":item.address
      }
      request("employee","put",param).then(res=>{
        if(res){
          message.success(res.message)
          form.resetFields();
          setVisible(false);
          getList();
        }
      })
    }
   
  }
  function onCancelModal() {
    setVisible(false)
    setEmployeeIdEdit(null)
    form.resetFields()
  }
  function clearFilter(){
         // setObjFilter({
        //     ...objFilter,
        //     page:1,
        //     txtSearch:"",
        //     categorySearch:null,
        //     productStatus:null
        // })
        // getlist(objFilter)

        var objClear = {
          ...objFilter,
          page:1,
          txtSearch:"",
          RoleIdSearch:null,
         
      }
      setObjFilter({...objClear})
      getList(objClear)
  }

  return (
    <div>
      <div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
      
        <h3>EmployeeDash:<span style={{ color: 'blue' }}>{list.length}</span> </h3>
        <Button type='primary' onClick={() => setVisible(true)} >New</Button>
      </div>
      <div>
      <div>
                   
                    <Space>
                        <Input.Search 
                            value={txtSearch}
                            placeholder="Search" 
                            allowClear={true}
                            style={{width:120}}
                            onChange={(event)=>{
                                setObjFilter({
                                    ...objFilter,
                                    txtSearch:event.target.value
                                })
                            }}
                        />
                        <Select
                            value={RoleIdSearch}
                            placeholder="Role"
                            style={{width:120}}
                            allowClear
                            onChange={(value)=>{
                                setObjFilter({
                                    ...objFilter,
                                    RoleIdSearch:value
                                })
                            }}
                        >
                            {role_idlist?.map((item,index)=>{
                                return (
                                    <Option key={index} value={item.role_id}>{item.name}</Option>
                                )
                            })}
                        </Select>


                        <Button  onClick={()=>getList(objFilter)} type="primary">Filter</Button>
                        <Button  onClick={()=>clearFilter()} >Clear</Button>
                    </Space>

                </div>
      </div>
      </div>
      <Table
       pagination={{
        defaultCurrent:1,
        pageSize:5,
        onChange:(page,pageSize)=>{
            setObjFilter({
                ...objFilter,
                page:page
            })
        },
        // onShowSizeChange  // Called when pageSize is changed

    }}
        columns={[
          {
            key: "no",
            title: "no",
            render: (text, record, index) => {
              return index + 1
            }
          },
          {
            key: "firstname",
            dataIndex: "firstname",
            title: "Firstname"

          },
          {
            key: "lastname",
            dataIndex: "lastname",
            title: "Lastname"
          },
          {
            key: "tel",
            dataIndex: "tel",
            title: "Tel"
          },
          {
            key: "password",
            dataIndex: "password",
            title: "password",
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
            key: "email",
            dataIndex: "email",
            title: "Email",
            
          },
          {
            key: "base_salary",
            dataIndex: "base_salary",
            title: "Salary"
          },
          {
            key: "province",
            dataIndex: "province",
            title: "Province",
           
            
          },
          {
            key: "role_id",
            dataIndex: "role_id",
            title: "Role",
            render: (text, record, index) => {
              let role_name;
              let tag_color;
          
              switch (text) {
                case 1:
                  role_name = "Admin";
                  tag_color = "green";
                  break;
                case 2:
                  role_name = "Manager";
                  tag_color = "brown";
                  break;
                case 3:
                  role_name = "Accountant";
                  tag_color = "blue";
                  break;
                case 4:
                  role_name = "Online Staff";
                  tag_color = "red";
                  break;
                case 7:
                  role_name = "New Staff";
                  tag_color = "gray";
                  break;
                default:
                  role_name = "New Staff";
                  tag_color = "black"; // Default color if role_id doesn't match any case.
              }
          
              return (
                <Tag color={tag_color}>{role_name}</Tag>
              );
            }
          },
          {
            key: "create_at",
            dataIndex: "create_at",
            title: "Create_at",
            render: (text, record, index) => {
              return formatDateClient(text)
            }
          },
          {
            key: "action",
            dataIndex: "action",
            title: "action",
            render: (text, record, index) => {
              return (
                <div>
                  <Space>
                    <Button type='primary' onClick={()=>onEditClick(record)}>Edit</Button>
                    <Button danger onClick={()=>onEditRemove(record)}>Delete</Button>
                  </Space>
                </div>
              )
            }
          },
        ]}
        dataSource={list} />
      <Modal open={visible} title={employeeIdEdit == null ? "Create" : "Edit"} onCancel={onCancelModal} footer={null} maskClosable={false} width={700} >
        <Form layout='vertical' form={form} onFinish={onFinish}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Firstname:" name="firstname" rules={[{ required: true, message: 'Please input your firstname!', },]} >
                <Input placeholder='firstname' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Lastname:" name="lastname" rules={[{ required: true, message: 'Please input your lastname!', },]} >
                <Input placeholder='lastname' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Tel:" name="tel" rules={[{ required: true, message: 'Please input your tel!', },]} >
                <Input placeholder='tel' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="password:" name="password" rules={[{ required: true, message: 'Please input your password!', },]} >
                <Input placeholder='password' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Salary:" name="base_salary" rules={[{ required: true, message: 'Please input your salary!', },]} >
                <Input placeholder='salary' />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                        label={"Role"}
                        name={"role_id"}
                    >
                       <Select
                            placeholder="Select a role"
                            allowClear={true}
                       >
                            {role_idlist?.map((item,index)=>{
                                return (
                                    <Option key={index} value={item.role_id}>{item.name}</Option>
                                )
                            })}
                       </Select>
                    </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="adress:" name="adress" rules={[{ required: false, message: 'Please input your adress!', },]} >
                <Input placeholder='adress' />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Province:" name="province" rules={[{ required: false, message: 'Please input your province!', },]} >
                <Input placeholder='province' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="email:" name="email" rules={[{ required: false, message: 'Please input your email!', },]} >
                <Input placeholder='email' />
              </Form.Item>
            </Col>
            
          </Row>

          {/* <Row>
            <Col span={12}>
              <Form.Item label="Province" name="province" rules={[{ required: true, message: 'Please input your province!', },]}>
                <Select allowClear={true} placeholder="Please select Province">
                  
                    {list_province?.map((item,index)=>{
                      return(
                        <Option key={index} value={item.province_id} >{item.name}</Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row> */}
          <Form.Item style={{ textAlign: 'right' }}>
            <Space align='end' >
              <Button danger>Cancel</Button>
              <Button onClick={()=>form.resetFields()}>Clear</Button>
              <Button htmlType='submit' type='primary'  >{employeeIdEdit == null ? "Save" : "Update"}</Button>
            </Space>

          </Form.Item>
        </Form>

      </Modal>

    </div>
  )
}

export default EmployeeDash
