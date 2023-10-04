// rfce : react function component export
import React from 'react'
import {Rate} from "antd"
import {AiFillHeart} from "react-icons/ai"

// how to add prop in React component
function ProductList(props) { // create function component
  
  return (
    <div
      style={{
        padding:20,
        backgroundColor : '#f9f9f9',
        marginTop:10
      }}  
    >
      <img
        src={props.image}
        width={"100%"}
      />
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <div style={{fontSize:18}}><b>{props.name}</b></div>
        <AiFillHeart style={{fontSize:24}}/>
      </div>
      <div style={{fontWeight:'bold'}}>{props.price}</div>
      <div>{props.desc}</div>
      <Rate />
      
    </div>
  )
}

export default ProductList
