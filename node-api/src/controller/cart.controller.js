const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");
// cart 
// cart_id product_id customer_id 
// 1       1          1          1
// 2       1          1          1
// 3       3          1
// 4       1          2
// 5      2           2
const getCartByCutomer = async (req,res) => {
    const {customer_id} = req.body;
    // var sql = "SELECT * FROM cart WEHERE customer_id = ?"

    // var sql = "SELECT cart.cart_id, cart.quantity, product.* FROM cart  "
    // sql += " INNER JOIN product  ON (cart.poroduct_id = product.product_id)"
    // sql += " WHERE cart.customer_id = ?"

    var sql = "SELECT c.cart_id, c.quantity, p.* FROM cart c"
    sql += " INNER JOIN product p ON (c.product_id = p.product_id)"
    sql += " WHERE c.customer_id = ?"
    const list = await db.query(sql,[customer_id])
    res.json({
        list:list
    })

}

const updateCart = async (req,res) => {
    const {
        cart_id,
        quantity // -1 | 1
    } = req.body
    var message = {}
    if(isEmptyOrNull(cart_id)) {message.cart_id = "cart_id required!"}
    if(isEmptyOrNull(quantity)) {message.quantity = "quantity required!"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
    }
    var sql = "UPDATE cart SET quantity=(quantity+?) WHERE cart_id=?"
    // 4 => 1 => (4+1) =5
    // 4 => -1 => (4-1) = 3
    var data = await db.query(sql,[quantity,cart_id])
    res.json({
        message:"Cart update success!",
        data:data
    })
}

const removeCart = async (req,res) => {
    var data = await db.query("DELETE FROM cart WHERE cart_id = ?",[req.body.cart_id])
    req.json({
        data:data,
        message:"Cart removed!"
    })
}

const addCart = async (req,res) => {
    const {
        customer_id,
        product_id,
        quantity
    } = req.body
    var message = {}
    if(isEmptyOrNull(customer_id)) {message.customer_id = "customer_id required!"}
    if(isEmptyOrNull(product_id)) {message.product_id = "product_id required!"}
    if(isEmptyOrNull(quantity)) {message.quantity = "quantity required!"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
    }
    var sql = "INSERT INTO cart (customer_id,product_id,quantity) VALUES (?,?,?)"
    var data = await db.query(sql,[customer_id,product_id,quantity])
    res.json({
        message:"Cart add success!",
        data:data
    })
}

module.exports = {
    getCartByCutomer,
    addCart,
    removeCart,
    updateCart,
}