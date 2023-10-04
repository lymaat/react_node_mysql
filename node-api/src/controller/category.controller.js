
// const {db} = require("../util/db")
const db = require("../util/db")
const { isEmptyOrNull } = require("../util/service")

const getAll = async (req,res) => {
    const list = await db.query("SELECT * FROM category");
    res.json({
        list:list,
    })

}

const getOne = (req,res) =>{
    var id = req.params.id // params from client 
    var sql = "SELECT * FROM category WHERE category_id = ?"
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
    	  			
    const {
        name,
        description,
        parent_id,
        status
    } = req.body

    // check which field required
    var message = {}
    if(isEmptyOrNull(name)){
        message.name = "category name required!";
        res.json({
            error : true,
            message : message
        })
        return 
    }
    
    var sql = "INSERT INTO category (`name`, `description`, `parent_id`, `status`) VALUES (?, ?, ?, ?)"
    var param_data = [name,description,parent_id,status]
    db.query(sql,param_data,(error,row)=>{
        if(error){
            res.json({
                error:true,
                message : error
            })
        }else{
            res.json({
                message:"Category create successfully!",
                data : row
            })
        }
    })
}

const update = (req,res) => {
    const {
        category_id,
        name,
        description,
        parent_id,
        status
    } = req.body

    // check which field required
    var message = {}
    if(isEmptyOrNull(name)){
        message.name = "category name required!";
        res.json({
            error : true,
            message : message
        })
        return 
    }else if(isEmptyOrNull(category_id)){
        message.name = "category_id required!";
        res.json({
            error : true,
            message : message
        })
        return 
    }

    var sql = "UPDATE category SET name=?, description=?, parent_id=?, status=? WHERE category_id = ?";
    var param_sql = [name,description,parent_id,status,category_id]
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

const remove = (req,res) => {
    var {id} = req.params
    var sql = "DELETE FROM category WHERE category_id = ?"
    db.query(sql,[id],(error,row)=>{
        if(!error){
            res.json({
                // message: (row.affectedRows != 0) ? "Delete successfully!" : "Data not in system",
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

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
}