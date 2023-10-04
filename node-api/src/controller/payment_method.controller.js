const db = require("../util/db")

const getAll = async (req,res) => {
    var sql = "SELECT * FROM payment_method"
    const list = await db.query(sql)
    res.json({
        list:list
    })
}

const create = async (req,res) => {
    var {name,code} = req.body
    var sql = "INSERT INTO payment_method (name,code) VALUES (?,?) "
    var param = [name,code]
    var data = await db.query(sql,param)
    res.json({
        message:"Create success!",
        data:data 
    })
}

const remove = async (req,res) => {
    var {payment_method_id} = req.body
    var sql = "DELETE FROM payment_method WHERE payment_method_id = ?"
    var data = await db.query(sql,[payment_method_id])
    res.json({
        message:"Remove success!",
        data:data 
    })
}

module.exports = {
    getAll,create,remove
}