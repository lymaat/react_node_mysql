import React from 'react'
import {Carousel} from "antd"
import "./CarouselHome.css"
import mac1 from "../../assets/product/mac1.png"
import mac2 from "../../assets/product/mac2.png"
function CarouselHome() {
    const dataSlid = [
        {
            title : "Hot Mac OS 2023",
            sub_title : "Sub title1",
            image : mac1,
            bg_color:  "pink"
        },
        {
            title : "Content2",
            sub_title : "Sub title1",
            image : mac2,
            bg_color:  "gray"
        },
        {
            title : "Content2",
            sub_title : "Sub title1",
            image : mac1,
            bg_color:  "red"
        }
    ]
    return (
        <Carousel autoplay>
            {dataSlid.map((item,index)=>{
                 return (
                    <div key={index} className='itemSlid'>
                        <img 
                            src={item.image}
                            width={150}
                        />
                        <h1>{item.title}</h1>
                        <div>{item.sub_title}</div>

                    </div> 
                ) 
            })}
        </Carousel>
    )
}

export default CarouselHome
