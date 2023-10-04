const db = require("../util/db")

const getAll = async (req,res) => {
    var sql = "SELECT * FROM order_status"
    const list = await db.query(sql)
    res.json({
        list:list
    })
}

const create = async (req,res) => {
    var {name,message,sort_order} = req.body
    var sql = "INSERT INTO order_status (name,message,sort_order) VALUES (?,?,?) "
    var param = [name,message,sort_order]
    var data = await db.query(sql,param)
    res.json({
        message:"Product added!",
        data:data 
    })
}

const remove = async (req,res) => {
    var {order_status_id} = req.body
    var sql = "DELETE FROM order_status WHERE order_status id= ?"
    var data = await db.query(sql,[order_status_id])
    res.json({
        message:"Remove success!",
        data:data 
    })
}

module.exports = {
    getAll,create,remove
}