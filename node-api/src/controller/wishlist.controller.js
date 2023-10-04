const db = require("../util/db")

const getAll = async (req,res) => {
    const {customer_id} = req.body
    var sql = "SELECT * FROM wishlist WHERE customer_id = ?"
    // var sql = "SELECT wl.id, p.* FROM wishlist wl "
    // sql += " INNER JON product p ON (p.product_id = wl.product_id) "
    // sql += " WHERE wl.customer_id = ?"
    const list = await db.query(sql,[customer_id])
    res.json({
        list:list
    })
}
const create = async (req,res) => {
    var {customer_id,product_id} = req.body
    var sql = "INSERT INTO wishlist (customer_id,product_id) VALUES (?,?) "
    var param = [customer_id,product_id]
    var data = await db.query(sql,param)
    res.json({
        message:"Product added!",
        data:data 
    })
}
const remove = async (req,res) => {
    const {wishlist_id} = req.body
    var sql = "DELETE FROM wishlist WHERE wishlist_id = ?"
    var data = await db.query(sql,[wishlist_id])
    res.json({
        message:"Product remove from your whishlist!",
        data:data 
    })
}

module.exports = {
    getAll,create,remove
}