
const db = require("../util/db")
const { isEmptyOrNull, TOKEN_KEY, REFRESH_KEY } = require("../util/service")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { getPermissionUser } = require("./auth.controller")
const getParam = (value) => {
    if(value == "" || value == "null" || value == "undefined"){
        return null
    }
    return value
}

// const getAll = (req,res) => {
    
//     var sql = "SELECT firstname AS FirstName, lastname AS LastName FROM employee"
//     db.query(sql,(error,row)=>{
//         if(error){
//             res.json({
//                 message:error,
//                 error:true
//             })
//         }else{
//             res.json({
//                 user : req.user,
//                 user_id : req.user_id,
//                 list:row
//             })
//         }
//     })
// }
const getAll = async (req, res) => {
    try {
        const { page,txtSearch,RoleIdSearch } = req.query;
        

        var param = [getParam(RoleIdSearch)]
        var limitItem = 10 
        var offset = (page - 1) * limitItem 

        var select = "SELECT e.*, r.name as role_name ";
        var join =  " FROM employee e " +
            " INNER JOIN role r ON (e.role_id = r.role_id) ";
        var where = " WHERE e.role_id = IFNULL(?,e.role_id) "
        
        if (!isEmptyOrNull(txtSearch)) {
            where += " AND e.tel = ? OR e.firstname LIKE ? OR e.lastname LIKE ? " //"' + txtSearch + '"
            param.push(txtSearch)
            param.push("%"+txtSearch+"%")
            param.push("%"+txtSearch+"%")
        }
       
        var order = " ORDER BY e.role_id DESC "
        var limit = " LIMIT "+limitItem+" OFFSET "+offset+""

        var sql = select + join + where + order + limit;
        const list = await db.query(sql,param)
        

        var sqlCategory = "SELECT * FROM role"
        const role_id = await db.query(sqlCategory)
   
        res.json({
            list: list,
          
           
            //  {
            //     tatalQty : totalRecord[0].tatalQty,
            //     total : totalRecord[0].total
            // },
            role_idlist: role_id,
            bodyData: req.body,
            queryData: req.query,
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({
            message: 'Internal Error!',
            error: e
        });
    }

}
// const getAll = async  (req,res) => {
    
//     var sqlgetAll = "SELECT * FROM employee  " 
//     var sqlgetProvince = "SELECT * FROM province"
//     var sqlRole = "SELECT * FROM role"

   
//     var listEmployee = await db.query(sqlgetAll)
//     var Province = await db.query(sqlgetProvince)
//     var Role = await db.query(sqlRole)
   
    
//     res.json({
//         list_province:Province,
//         list:listEmployee,
//         role_idlist:Role,
//         user: req.user,
//         user_id : req.user_id
//     })
// }

const getOne = (req,res) =>{
    var id = req.params.id // params from client 
    var sql = "SELECT * FROM employee WHERE employee_id = ?"
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

    // check is exist
    // parameter required
    // password bcrypt
    // inert two tables customer/customer_address 

       var {
        firstname,
        lastname,
        tel,
        password,
        email,
        base_salary,
        address,
        province,
        country,
        role_id
    } = req.body
    // validate parameters
    var message  = {}
    if(isEmptyOrNull(firstname)){message.firstname="firstname required!"}
    if(isEmptyOrNull(lastname)){message.lastname="lastname required!"}
    if(isEmptyOrNull(tel)){message.tel="tel required!"}
    if(isEmptyOrNull(password)){message.password="password required!"}
    // if(isEmptyOrNull(address)){message.address="address required!"}
    // if(isEmptyOrNull(province_id)){message.province_id="province_id required!"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return false
    }
    // end validate parameters

    var sqlFind = "SELECT employee_id FROM employee WHERE tel = ? " // sql check customer by username
    db.query(sqlFind,[tel],(error1,result1)=>{
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

            var sqlCustomer = "INSERT INTO employee (firstname, lastname, tel, password, email, base_salary, address, province, country, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
            var paramCustomer = [firstname, lastname, tel, password, email, base_salary, address, province, country, role_id]
            db.query(sqlCustomer,paramCustomer,(error2,result2)=>{ // insert to customer
                if(!error2){
                    res.json({
                        message:"Account created!",
                        data:result2
                    })
                  
                }else{
                    res.json({
                        message:error2,
                        error:true

                    })
                    }
            })
        }
    })
}
// const create = (req,res) => {
//     const {
//         firstname,
//         lastname,
//         tel,
//         email,
//         base_salary,
//         address,
//         province,
//         country,
//         role_id
//     } = req.body

//     // check which field required
//     var message = {}
//     if(isEmptyOrNull(firstname)){
//         message.firstname = "firstname required!"
//     }
//     if(isEmptyOrNull(lastname)){
//         message.lastname = "lastname required!"
//     }
//     if(isEmptyOrNull(tel)){
//         message.tel = "tel required!"
//     }
//     if(isEmptyOrNull(role_id)){
//         message.role_id = "rolde_id required!"
//     }
//     // Object.keys(message).length // return length of object message
//     if(Object.keys(message).length > 0 ){
//         res.json({
//             error : true,
//             message : message
//         })
//         return 
//     }
//     // end check which field required

//     var sql = "INSERT INTO employee (`firstname`, `lastname`, `tel`, `email`, `base_salary`, `address`, `province`, `country`,`role_id`) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)"
//     var param_data = [firstname,lastname,tel,email,base_salary,address,province,country,role_id]
//     db.query(sql,param_data,(error,row)=>{
//         if(error){
//             res.json({
//                 error:true,
//                 message : error
//             })
//         }else{
//             res.json({
//                 message:"Employee create successfully!",
//                 data : row
//             })
//         }
//     })
// }

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
    var user = await db.query("SELECT * FROM employee WHERE tel = ?",[username]);
    if(user.length > 0){
        var passDb = user[0].password // get password from DB (#$@*&(FKLSHKLERHIUH@OIUH@#))
        var isCorrrect = bcrypt.compareSync(password,passDb)
        if(isCorrrect){
            var user = user[0]
            delete user.password; // delete colums password from object user'
            var permission = await getPermissionUser(user.employee_id)
            var obj = {
                user:user,
                permission:permission,
            }
            var access_token = jwt.sign({data:{...obj}},TOKEN_KEY,{expiresIn:"2h"})
            var refresh_token = jwt.sign({data:{...obj}},REFRESH_KEY)
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

const refreshToken = async (req,res)=>{
    // check and verify refresh_token from client 
    var {refresh_key} = req.body;
    if(isEmptyOrNull(refresh_key)){
        res.status(401).send({
            message: 'Unauthorized',
        });
    }else{
        jwt.verify(refresh_key,REFRESH_KEY, async (error,result)=>{
            if(error){
                res.status(401).send({
                    message: 'Unauthorized',
                    error: error
                });
            }else{
                // សុំសិទ្ធទាញុយក acccess token ថ្មី
                var username = result.data.user.tel;
                var user = await db.query("SELECT * FROM employee WHERE tel = ?",[username]);
                var user = user[0]
                delete user.password; // delete colums password from object user'
                var permission = await getPermissionUser(user.employee_id)
                var obj = {
                    user:user,
                    permission:permission,
                }
                var access_token = jwt.sign({data:{...obj}},TOKEN_KEY,{expiresIn:"30s"})
                var refresh_token = jwt.sign({data:{...obj}},REFRESH_KEY)
                res.json({
                    ...obj,
                    access_token:access_token,
                    refresh_token:refresh_token,
                })
            }
        })
    }
}


const setPassword = async (req,res) => {
    const {
        tel,
        password
    } = req.body;
    var message = {};
    if(isEmptyOrNull(tel)) {message.tel = "Please fill in tel!"}
    if(isEmptyOrNull(password)) {message.password = "Please fill in password!"}
    if(Object.keys(message).length>0){
        res.json({
            error:true,
            message:message
        })
        return 
    }
    var employee = await db.query("SELECT * FROM employee WHERE tel = ?",[tel]);
    if(employee.length > 0){
        var passwordGenerate =  bcrypt.hashSync(password,10) //  12344 => "jsERWERQ@#RSDFA#%$%#$%#@$%#$%SDFA#$#"
        var update = await db.query("UPDATE employee SET password = ? WHERE tel=? ",[passwordGenerate,tel])
        res.json({
            message:"Password update",
            data:update
        })
    }else{
        res.json({
            message:"Account does't exist!. Please goto register!",
            error:true
        })
    }
}

const update = (req,res) => {
    var {
        employee_id,
        firstname,
        lastname,
        tel,
        password,
        email,
        base_salary,
        address,
        province,
        country,
        role_id
    } = req.body

    // check which field required
    var message = {}
    if(isEmptyOrNull(employee_id)){
        message.employee_id = "employee_id required!"
    }
    if(isEmptyOrNull(firstname)){
        message.firstname = "firstname required!"
    }
    if(isEmptyOrNull(lastname)){
        message.lastname = "lastname required!"
    }
    if(isEmptyOrNull(tel)){
        message.tel = "tel required!"
    }
    // Object.keys(message).length // return length of object message
    if(Object.keys(message).length > 0 ){
        res.json({
            error : true,
            message : message
        })
        return 
    }
    // end check which field required
    password = bcrypt.hashSync(password,10) 
    var sql = "UPDATE employee SET firstname=?, lastname=?, tel=?,email=?, base_salary=?, address=?, province=?, country=?, password=?, role_id=? WHERE employee_id = ?";
    var param_sql = [firstname,lastname,tel,email,base_salary,address,province,country,password,role_id,employee_id]
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

const remove = (req, res) => {
    var { id } = req.params;
    
    // Check if the employee has role_id = 1 (admin) before attempting to delete.
    var checkRoleSql = "SELECT role_id FROM employee WHERE employee_id = ?";
    db.query(checkRoleSql, [id], (error, rows) => {
        if (error) {
            res.json({
                error: true,
                message: error
            });
        } else {
            if (rows.length > 0 && rows[0].role_id === 1) {
                res.json({
                    message: "Admins cannot be deleted."
                });
            } else {
                // Employee is not an admin, proceed with deletion.
                var deleteSql = "DELETE FROM employee WHERE employee_id = ?";
                db.query(deleteSql, [id], (deleteError, deleteRow) => {
                    if (!deleteError) {
                        res.json({
                            message: (deleteRow.affectedRows != 0) ? "Delete successfully!" : "Data not in the system",
                            data: deleteRow
                        });
                    } else {
                        res.json({
                            error: true,
                            message: deleteError
                        });
                    }
                });
            }
        }
    });
};


module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    login,
    setPassword,
    refreshToken
}