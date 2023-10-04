import React from 'react'
import {Row,Col} from "antd"
import mac1 from "../../assets/product/mac1.png"
import mac2 from "../../assets/product/mac2.png"
import ProductList from '../../component/list/ProductList'

function HomeHotItem(props) {
  const data =   [
        {
            name : "Macbook 2023",
            image : mac1,
            bg_color:  "pink",
            price : 2000
        },
        {
            name : "Macbook 2020",
            image : mac2,
            bg_color:  "gray",
            price : 2000
        },
        {
            name : "Macbook 2021",
            image : mac1,
            bg_color:  "red",
            price : 2000
        },
        {
            name : "Macbook 2023",
            image : mac1,
            bg_color:  "pink",
            price : 2000
        },
        {
            name : "Macbook 2020",
            image : mac2,
            bg_color:  "gray",
            price : 2000
        },
        {
            name : "Macbook 2023",
            image : mac1,
            bg_color:  "pink",
            price : 2000
        },
        {
            name : "Macbook 2020",
            image : mac2,
            bg_color:  "gray",
            price : 2000
        },
        {
            name : "Macbook 2023",
            image : mac1,
            bg_color:  "pink",
            price : 2000
        },
        {
            name : "Macbook 2020",
            image : mac2,
            bg_color:  "gray",
            price : 2000
        },
       
    ]
  return (
    <div style={{paddingLeft:"10%",paddingRight:"10%"}}>
      <div style={{fontSize:35,fontWeight:"bolder"}}>Hot Product</div>
      <Row gutter={12}>
        {data.map((item,index)=>{
            return (
                <Col key={index} sm={{span:24}} md={{span:8}} lg={{span:6}}>
                    <ProductList
                        name = {item.name}
                        price = {item.price+ "$"}
                        desc = "Desc"
                        image = {item.image}
                    />
                </Col>
            )
        })}
        {/* <Col span={6}>
            <h1>1</h1>
        </Col>
        <Col span={6}>
            <h1>2</h1>
        </Col>
        <Col span={6}>
            <h1>3</h1>
        </Col>
        <Col span={6}>
            <h1>4</h1>
        </Col>
        <Col span={6}>
            <h1>4</h1>
        </Col> */}
      </Row>
    </div>
  )
}

export default HomeHotItem
