import React, { useState } from 'react';
import { Button, Checkbox, Form, Input,message } from 'antd';
import "./LoginDashBoard.css"
import { request } from '../../share/request';
import { storeProfileData, storeUserData } from '../../share/helper';
import {Link} from "react-router-dom"

const LoginDashBoard = () => {
  
  const [loading,setLoading] = useState(false)
  const onFinish = (values) => {
    setLoading(true)
    var param = {
      "username" : values.username,//"0998887778",
      "password" : values.password, //"123456"
    }
    request("employee_login","post",param).then(res=>{
      setLoading(false)
      if(!res.error){
        storeUserData(res)
        // localStorage.setItem("isLogin","1")
        // localStorage.setItem("access_token",res.access_token)
        // localStorage.setItem("refresh_token",res.refresh_token)
        // localStorage.setItem("permission",JSON.stringify(res.permission))
        // localStorage.setItem("user",JSON.stringify(res.user))
        window.location.href="/dashboard"
      }else{
        message.error(res.message)
      }
    })
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  

  return (
    <div className='LoginDashBoardContainer'>
    <div className='box'>
      <div className='form'>
      <h1>Login</h1>
      <Form
        name="basic"
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        
        <Form.Item
          style={{textAlign:"right"}}
          // wrapperCol={{
          //   offset: 12,
          //   span: 12,
          // }}
        >
          <div className="links">
          <br />
          <br />
          <Link to="/login/forgotpassword" >forgot password?</Link>
          <a href="#">Sign Up</a>
        </div>
      <br />
          <Button loading={loading} type="primary" htmlType="submit" className="btnlogin">
            Login
          </Button>
          <br />
          <br />

        </Form.Item>
  
      </Form>
      </div>
    </div>
    </div>
    
   
  )
  
  
}

export default LoginDashBoard;

// import React from 'react'
// import "./LoginDashBoard.css"

// function LoginDashBoard() {
//     const onLogin = () => {
//         // check in api : past username,password
//         // login success

//         // localStorage.setItem("key","value") // create new local variable "" 
//         // const data = localStorage.getItem("key") // get value from local variable
//         // localStorage.removeItem("key") // remove key
        
//         localStorage.setItem("isLogin","1")
//         window.location.href="/dashboard"
//     }
//   return (
//     <div>
//         <div className='LoginDashBoardContainer'>
//             <div>Login</div>
//             <input placeholder='Username'/><br/>
//             <input placeholder='Passsword'/><br/>
//             <div>
//                 <button onClick={onLogin}>Login</button>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default LoginDashBoard



