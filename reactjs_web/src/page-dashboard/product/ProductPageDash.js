import { useEffect, useRef, useState } from "react"
import {request} from "../../share/request"
import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Table, Tag, message,
} from "antd"
import { formatDateClient, isEmptyOrNull } from "../../share/helper"
import {
    EditFilled,
    DeleteFilled
} from "@ant-design/icons"
import MainPageDash from "../component-dash/mainpage/MainPageDash"
import PrintInvoice from "../POS/PrintInvoice"
import { useReactToPrint } from "react-to-print"
import { InvoiceContentToPrint } from "../POS/InvoiceContentToPrint"

const {Option} = Select


const ProductPageDash = () => {

    const [loading,setLoading] = useState(false)
    const [list,setList] = useState([])
    const [totalRecord,setTotalRecord] = useState(0)
    const [categoryList,setCategoryList] = useState([])
    // const [brand,setBrand] = useState([])
    const [visible,setVisible] = useState(false)
    const [productIdEdit,setProductIdEdit] = useState(null)
    const [form] = Form.useForm();

    const [objFilter,setObjFilter] = useState({
        page : 1,
        txtSearch: "",
        categorySearch: null,
        productStatus : null
    })
    const {page,txtSearch,categorySearch,productStatus} = objFilter
    

    useEffect(()=>{
        getList(objFilter)
    },[page])

    const getList = (parameter={}) => {
        setLoading(true)
        var param = "?page="+(parameter.page || 1)
        param += "&txtSearch="+(parameter.txtSearch || "" )
        param += "&categoryId="+(parameter.categorySearch)
        param += "&productStatus="+(parameter.productStatus) 
        request("product"+param,"get",{}).then(res=>{
            setTimeout(() => {
                setLoading(false)
            }, 200);
            
            if(res){
                setList(res.list)
                if(res.totalRecord.length > 0){
                    setTotalRecord(res.totalRecord[0])
                }
                
                setCategoryList(res.list_category)
                // setBrand(res.brand)
            }
        })
    }

    const clearFilter = () => {
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
            categorySearch:null,
            productStatus:null
        }
        setObjFilter({...objClear})
        getList(objClear)
    }

    const onCancelModal = () => {

        setVisible(false)
        setProductIdEdit(null)
        form.resetFields()
    }

    const onFinish = (item) => {
        if(productIdEdit == null){
            var param = {
                "category_id" : item.category,
                "barcode" :  item.barcode,
                "name" :  item.product_name,
                "quantity" :  item.qauntity,
                "price" :  item.price,
                "image" :  item.image,
                "description" :  item.description,
            }
            setLoading(true)
            request("product","post",param).then(res=>{
                setTimeout(() => {
                    setLoading(false)
                }, 1000);
                if(res){
                    message.success(res.message)
                    form.resetFields();
                    setVisible(false);
                    getList()
                }
            })
        }else{
            var param = {
                "product_id" : productIdEdit,
                "category_id" : item.category,
                "barcode" :  item.barcode,
                "name" :  item.product_name,
                "quantity" :  item.qauntity,
                "price" :  item.price,
                "image" :  item.image,
                "description" :  item.description,
            }
            setLoading(true)
            request("product","put",param).then(res=>{
                setLoading(false)
                if(res){
                    message.success(res.message)
                    form.resetFields();
                    setVisible(false);
                    getList()
                }
            })
        }
        
    }

    const onEditClick = (item) => {
        setVisible(true)
        setProductIdEdit(item.product_id)
        form.setFieldsValue({
            category : item.category_id,
            barcode : item.barcode,
            product_name : item.name,
            qauntity :item.quantity,
            price : item.price,
            image : item.image,
            description : item.description
        })
    }

    const onEditRemove = (item) => {
        var param = {
            id:item.product_id
        }
        request("product","delete",param).then(res=>{
            if(res){
                message.success(res.message)
                getList()
            }
        })
    }

    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      onBeforePrint:()=>{console.log("before print")},
      onAfterPrint:()=>{console.log("affter print or cancel")},
      onPrintError:()=>{console.log("error print")},
    //   bodyClass:
       
    });

    return(
        <MainPageDash
            loading={loading}
        >
            {/* <div style={{display:'none'}}>
                <InvoiceContentToPrint ref={componentRef} />
            </div>
            <Button onClick={handlePrint} type="primary">Print</Button> */}

            <div style={{display:"flex",justifyContent:'space-between',padding:10}}>
                <div>
                    <div style={{paddingBottom:5}}>
                        <div style={{fontSize:16,fontWeight:'bold'}}>Product</div>
                        <div style={{color:"#555",fontSize:12}}>{totalRecord?.total} Items</div>
                        <div style={{color:"#555",fontSize:12}}>{totalRecord?.totalQty} PCS</div>
                    </div>
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
                            value={categorySearch}
                            placeholder="Category"
                            style={{width:120}}
                            allowClear
                            onChange={(value)=>{
                                setObjFilter({
                                    ...objFilter,
                                    categorySearch:value
                                })
                            }}
                        >
                            {categoryList?.map((item,index)=>{
                                return (
                                    <Option key={index} value={item.category_id}>{item.name}</Option>
                                )
                            })}
                        </Select>

                        <Select
                            value={productStatus}
                            placeholder="Status"
                            style={{width:120}}
                            allowClear
                            onChange={(value)=>{
                                setObjFilter({
                                    ...objFilter,
                                    productStatus:value
                                })
                            }}
                        >
                            <Option  value={"1"}>Actived</Option>
                            <Option  value={"0"}>Disabled</Option>
                        </Select>

                        <Button  onClick={()=>getList(objFilter)} type="primary">Filter</Button>
                        <Button  onClick={()=>clearFilter()} >Clear</Button>
                    </Space>

                </div>
                <Button onClick={()=>setVisible(true)}  type="primary">New</Button>
            </div>
            <Table 
                // pagination={true}
                pagination={{
                    defaultCurrent:1,
                    total:totalRecord?.total,
                    pageSize:10,
                    onChange:(page,pageSize)=>{
                        setObjFilter({
                            ...objFilter,
                            page:page
                        })
                    },
                    // onShowSizeChange  // Called when pageSize is changed

                }}
                
                // size="small"
                columns={[
                    {
                        key:"no",
                        title:"No",
                        // render:(item,recorde,index)=>index+1
                        render:(item,recorde,index)=>{
                            return index + 1
                        }
                    },
                    {
                        key:"barcode",
                        title:"Barcode",
                        dataIndex:"barcode",
                    },
                    {
                        key:"name",
                        title:"Name",
                        dataIndex:"name",
                    },
                    {
                        key:"quantity",
                        title:"Quantity",
                        dataIndex:"quantity"
                    },
                    {
                        key:"price",
                        title:"Price",
                        dataIndex:"price"
                    },
                    {
                        key:"category_name",
                        title:"Category",
                        dataIndex:"category_name"
                    },
                    {
                        key:"image",
                        title:"Image",
                        dataIndex:"image"
                    },
                    {
                        key:"description",
                        title:"Description",
                        dataIndex:"description"
                    },
                    {
                        key:"is_active",
                        title:"Active",
                        dataIndex:"is_active",
                        render:(text,record,index)=>{
                            return (
                                <Tag color={text == 1 ? "green" : "pink"} key={"1"}>
                                    {text == 1 ? "Actived" : "Disabled"}
                                </Tag>
                            )
                        }
                    },
                    {
                        key:"create_at",
                        title:"Create",
                        dataIndex:"create_at",
                        render:(text,record,index)=>{
                            return formatDateClient(text)
                        }
                    },
                    {
                        key:"action",
                        title:"Acton",
                        render:(text,record,index)=>{
                            return (
                                <Space key={index}>
                                    <Button onClick={()=>onEditClick(record)} type="primary" ><EditFilled/></Button>
                                    <Button onClick={()=>onEditRemove(record)} danger ><DeleteFilled/></Button>
                                </Space>
                            )
                        }
                    },
                    
                    
                ]}
                dataSource={list}
                
            />
            {/* Modal */}
            <Modal
                open={visible}
                title={productIdEdit == null  ? "Create" : "Edit"}
                onCancel={onCancelModal}
                footer={null}
                maskClosable={false}
                width={600}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={"Barcode"}
                                name={"barcode"}
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please input barcode!',
                                    },
                                ]}
                            >
                                <Input placeholder="Barcode" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={"Product Name"}
                                name={"product_name"}
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please input product name!',
                                    },
                                ]}
                            >
                                <Input placeholder="Product name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={"Qauntity"}
                                name={"qauntity"}
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please input qauntity!',
                                    },
                                ]}
                            >
                                <Input placeholder="qauntity" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item

                                label={"Price"}
                                name={"price"}
                                rules={[
                                    {
                                      required: true,
                                      message: 'Please input product price!',
                                    },
                                ]}
                            >
                                <Input allowClear={true} placeholder="Product name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={"Category"}
                        name={"category"}
                    >
                       <Select
                            placeholder="Select a category"
                            allowClear={true}
                       >
                            {categoryList?.map((item,index)=>{
                                return (
                                    <Option key={index} value={item.category_id}>{item.name}</Option>
                                )
                            })}
                       </Select>
                    </Form.Item>

                    {/* <Form.Item
                        label={"Brand"}
                        name={"brand"}
                    >
                       <Select
                            placeholder="Select a brand (optional)"
                            allowClear={true}
                       >
                            {brand?.map((item,index)=>{
                                return (
                                    <Option key={index} value={item.id}>{item.name}</Option>
                                )
                            })}
                       </Select>
                    </Form.Item> */}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={"Image"}
                                name={"image"}
                            >
                                <Input placeholder="image" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={"Description"}
                                name={"description"}
                            >
                                <Input placeholder="Product name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Form.Item style={{textAlign:'right'}}>
                        <Space align="end">
                            <Button  type="default">Cancel</Button>
                            <Button onClick={()=>form.resetFields()} type="default">Clear</Button>
                            <Button htmlType="submit"  style={{backgroundColor:"green"}}>{productIdEdit == null ? "Save" : "Update"}</Button>
                        </Space>
                    </Form.Item>

               </Form>
            </Modal>
            {/* End Modal */}
        </MainPageDash>
    )
}

export default ProductPageDash;