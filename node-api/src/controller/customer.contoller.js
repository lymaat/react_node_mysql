
// const {db} = require("../util/db")
const db = require("../util/db")
const { isEmptyOrNull, TOKEN_KEY } = require("../util/service")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



const getAll = async  (req,res) => {
    var sqlProvince = "SELECT * FROM province " 
    var sqlCustomer = "SELECT customer_id,firstname,lastname,gender,province_id,address_des,username,password,is_active,create_at FROM customer ORDER BY customer_id DESC"
    var listProvince = await db.query(sqlProvince)
    var listCustomer = await db.query(sqlCustomer)
    
    res.json({
        list:listCustomer,
        listProvince:listProvince,
    })
}

const getOne = (req,res) =>{
    var id = req.params.id // params from client 
    var sql = "SELECT customer_id,firstname,lastname,gender,is_active,create_at FROM customer WHERE customer_id = ?"
    db.query(sql,[id],(error,row)=>{
        if(error){
            res.json({
                message:error,
                error:true
            })
        }else{
            res.json({
                list:row
            })
        }
    })  
}

const create = (req,res) => {
    db.beginTransaction()
    // check is exist
    // parameter required
    // password bcrypt
    // inert two tables customer/customer_address 
    
    var {
        username, // store telephone
        password,
        firstname,
        lastname,
        gender,
        province_id,
        address_des
    } = req.body;
    // validate parameters
    var message  = {}
    if(isEmptyOrNull(username)){message.username="username required!"}
    if(isEmptyOrNull(password)){message.password="password required!"}
    if(isEmptyOrNull(firstname)){message.firstname="firstname required!"}
    if(isEmptyOrNull(lastname)){message.lastname="lastname required!"}
    if(isEmptyOrNull(gender)){message.gender="gender required!"}
    if(isEmptyOrNull(province_id)){message.province_id="province_id required!"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return false
    }
    // end validate parameters

    // check is existing customer by tel=username
    var sqlFind = "SELECT customer_id FROM customer WHERE username = ? " // sql check customer by username
    db.query(sqlFind,[username],(error1,result1)=>{
        if(result1.length > 0){ // have record => exist cusomter 
            res.json({
                error:true,
                message:"Account already exist!"
            })
            return false;
        }else{
            // bycript passwrod from client
            // password = 121234f => "jsERWERQ@#RSDFA#%$%#$%#@$%#$%SDFA#$#"
            password = bcrypt.hashSync(password,10) //  12344 => "jsERWERQ@#RSDFA#%$%#$%#@$%#$%SDFA#$#"

            var sqlCustomer = "INSERT INTO customer (firstname, lastname, gender, username, password) VALUES (?, ?, ?, ?, ?) "
            var paramCustomer = [firstname, lastname, gender, username, password]
            console.log(sqlCustomer)
            db.query(sqlCustomer,paramCustomer,(error2,result2)=>{ // insert to customer
                if(!error2){
                    // insert customer_address
                    var sqlCustomerAdd = "INSERT INTO customer_address (customer_id, province_id, firstname, lastname, tel, address_des) VALUES (?,?,?,?,?,?) "
                    var paramCustomerAdd = [result2.insertId, province_id, firstname, lastname, username, address_des]
                    console.log(sqlCustomerAdd)
                    db.query(sqlCustomerAdd,paramCustomerAdd,(error3,result3)=>{
                        if(!error3){
                            res.json({
                                message:"Account created!",
                                data:result3
                            })
                            db.commit()
                        }else{
                            db.rollback()
                            res.json({
                                error:true,
                                message:error3
                            })
                            
                        }
                    })
                }
            })
        }
    })
}


const login = async (req,res) => {
    var {username,password} = req.body;
    var message = {};
    if(isEmptyOrNull(username)) {message.username = "Please fill in username!"}
    if(isEmptyOrNull(password)) {message.password = "Please fill in password!"}
    if(Object.keys(message).length>0){
        res.json({
            error:true,
            message:message
        })
        return 
    }
    var user = await db.query("SELECT * FROM customer WHERE username = ?",[username]);
    if(user.length > 0){
        var passDb = user[0].password // get password from DB (#$@*&(FKLSHKLERHIUH@OIUH@#))
        var isCorrrect = bcrypt.compareSync(password,passDb)
        if(isCorrrect){
            var user = user[0]
            delete user.password; // delete colums password from object user'
            var obj = {
                user:user,
                permission:[],
                token:"" // generate token JWT
            }
            var access_token = jwt.sign({data:{...obj}},TOKEN_KEY,{expiresIn:"30s"})
            var refresh_token = jwt.sign({data:{...obj}},TOKEN_KEY)
            res.json({
                ...obj,
                access_token:access_token,
                refresh_token:refresh_token,
            }) 
        }else{
            res.json({
                message:"Password incorrect!",
                error:true
            }) 
        }
    }else{
        res.json({
            message:"Account does't exist!. Please goto register!",
            error:true
        })
    }
}

const update = (req,res) => { // update profile
    const {
        customer_id,
        firstname,
        lastname,
        gender,
    } = req.body

    // check which field required
    var message = {}
    if(isEmptyOrNull(customer_id)){message.customer_id = "Customer id required!"}
    if(isEmptyOrNull(firstname)){message.firstname = "Customer firstname required!"}
    if(isEmptyOrNull(lastname)){message.lastname = "Customer lastname required!"}
    if(isEmptyOrNull(gender)){message.gender = "Customer gender required!"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return;
    }

    var sql = "UPDATE customer SET firstname=?, lastname=?, gender=? WHERE customer_id = ?";
    var param_sql = [firstname,lastname,gender,customer_id]
    db.query(sql,param_sql,(error,row)=>{
        if(error){
            res.json({
                error:true,
                message:error
            })
        }else{
            res.json({
                message : row.affectedRows ? "Update successfully!" : "Data not in system!",
                data : row
            })
        }
    })

}

// customer (delete) // customer_address auto
// category (delete : no id use in child) // product


const remove = (req,res) => {
    var sql = "DELETE FROM customer WHERE customer_id = ?"
    // var sql = "UPDATE customer SET is_active = 0 WHERE customer_id = ? "
    db.query(sql,[req.params.id],(error,row)=>{
        if(!error){
            // customer_address 
            var sql = ""
            res.json({
                message: (row.affectedRows) ? "Delete successfully!" : "Data not in system",
                data:row
            })
        }else{
            res.json({
                error:true,
                message:error
            })
        }
    })
}

const listAddress = (req,res) => {
    var {
        customer_id
    } = req.body
    var sql = "SELECT * FROM customer_address WHERE customer_id = ?";
    db.query(sql,[customer_id],(error,row)=>{
        if(!error){
            res.json({
                list : row
            })
        }
    })
}
const listOneAddress = (req,res) => {
    var {
        customer_id
    } = req.params
    var sql = "SELECT * FROM customer_address WHERE customer_address_id = ?";
    db.query(sql,[customer_id],(error,row)=>{
        if(!error){
            res.json({
                list : row
            })
        }
    })
}
const newAddress = (req,res) => {
    var {
        customer_id,
        firstname,
        lastname,
        tel,
        province_id,
        address_des
    } = req.body;
    var message = {}
    if(isEmptyOrNull(customer_id)) { message.customer_id = "customer_id required!"}
    if(isEmptyOrNull(firstname)) { message.firstname = "firstname required!"}
    if(isEmptyOrNull(lastname)) { message.lastname = "lastname required!"}
    if(isEmptyOrNull(tel)) { message.tel = "tel required!"}
    if(isEmptyOrNull(province_id)) { message.province_id = "province_id required!"}
    if(isEmptyOrNull(address_des)) { message.address_des = "address_des required!"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return;
    }
    var sql = "INSERT INTO customer_address (customer_id, province_id, firstname, lastname, tel, address_des) VALUES (?,?,?,?,?,?)";
    var param = [customer_id,province_id,firstname,lastname,tel,address_des]
    db.query(sql,param,(error,row)=>{
        if(error){
            res.json({
                error:true,
                message:error
            })
        }else{
            res.json({
                message : row.affectedRows ? "Create successfully!" : "Data not in system!",
                data : row
            })
        }
    })
}
const updateAddress = (req,res) => {
    var {
        customer_address_id,
        customer_id,
        firstname,
        lastname,
        tel,
        province_id,
        address_des
    } = req.body;
    var message = {}
    if(isEmptyOrNull(customer_address_id)) { message.customer_address_id = "customer_address_id required!"}
    if(isEmptyOrNull(customer_id)) { message.customer_id = "customer_id required!"}
    if(isEmptyOrNull(firstname)) { message.firstname = "firstname required!"}
    if(isEmptyOrNull(lastname)) { message.lastname = "lastname required!"}
    if(isEmptyOrNull(tel)) { message.tel = "tel required!"}
    if(isEmptyOrNull(province_id)) { message.province_id = "province_id required!"}
    if(isEmptyOrNull(address_des)) { message.address_des = "address_des required!"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return;
    }
    var sql = "UPDATE customer_address SET customer_id=?, province_id=?, firstname=?, lastname=?, tel=?, address_des=? WHERE customer_address_id = ?";
    var param = [customer_id,province_id,firstname,lastname,tel,address_des,customer_address_id]
    db.query(sql,param,(error,row)=>{
        if(error){
            res.json({
                error:true,
                message:error
            })
        }else{
            res.json({
                message : row.affectedRows ? "Create successfully!" : "Data not in system!",
                data : row
            })
        }
    })

}
const removeAddress = (req,res) => {
    var {
        customer_id
    } = req.params
    var sql = "DELETE FROM customer_address WHERE customer_address_id = ?";
    db.query(sql,[customer_id],(error,row)=>{
        if(!error){
            res.json({
                message : row.affectedRows ? "Remove success!" : "Not found in system!"
            })
        }
    })
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    listAddress,
    listOneAddress,
    newAddress,
    updateAddress,
    removeAddress,
    login
}