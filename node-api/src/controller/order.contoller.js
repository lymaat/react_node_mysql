
const db = require("../util/db")
const { isEmptyOrNull, invoiceNumber } = require("../util/service")

const generateInvoiceNo = async () => {
    const data = await db.query(" SELECT MAX( order_id ) as id FROM `order`; ");
    return invoiceNumber(data[0].id) //null 1 , 2, 3 
}

const getAll =  async (req,res) => {
    const list = await db.query("SELECT * FROM `order`;")
    res.json({
        list  : list,
    })
}
const getOne = async (req,res) => {
    const list = await db.query("SELECT * FROM order WHERE order_id = ?",[req.params.id])
    res.json({
        list  : list
    })
}

const getOderByCustomer = async (req,res) => {
    const {customer_id} = req.body;
    const list = await db.query("SELECT * FROM order WHERE customer_id = ?",[customer_id])
    res.json({
        list:list
    })
}

const create = async (req,res) => {
    try{
        db.beginTransaction()
        // order 
        const {
            customer_id,customer_address_id,payement_methode_id,comment,
        } = req.body;

        var message = {}
        if(isEmptyOrNull(customer_id)){message.customer_id = "customer_id required!"}
        if(isEmptyOrNull(payement_methode_id)){message.payement_methode_id = "payement_methode_id required!"}
        if(isEmptyOrNull(customer_address_id)){message.customer_address_id = "customer_address_id required!"}
        if(Object.keys(message).length> 0){
            res.json({
                message:message,
                error:true
            })
            return 0;
        }
        // find customer_address_info by address_id(from client)
        var address = await db.query("SELECT * FROM customer_address WHERE customer_address_id = ?",[customer_address_id])

        if(address?.length > 0){
           
            const {firstname,lastname,tel,address_des} = address[0]
           
            // find total_order => need getCartInfo by customer
            var product = await db.query("SELECT c.*, p.price FROM cart c  INNER JOIN product p ON (c.product_id = p.product_id)  WHERE c.customer_id = ?",[customer_id]);
            if(product.length > 0){
                // find total amont base from cart by customer
                var order_total = 0;
                product.map((item,index)=>{
                    order_total += (item.quantity * item.price)
                })
                // insert data to table order
                var order_status_id = 1 // Pendding
                var inv_no = await generateInvoiceNo();
                var sqlOrder = "INSERT INTO `order`"+
                " (customer_id, payement_methode_id, order_status_id , invoice_no, comment, order_total, firstname, lastname, telelphone, address_des) VALUES "+
                " (?,?,?,?,?,?,?,?,?,?)";
                var sqlOrderParam = [customer_id,payement_methode_id,order_status_id,inv_no,comment,order_total,firstname,lastname,tel,address_des]
                const order = await db.query(sqlOrder,sqlOrderParam)
                // insert order_detail 
                product.map( async (item,index)=>{
                    var sqlOorderDetails = "INSERT INTO order_detail (order_id,product_id,quantity,price) VALUES (?,?,?,?)"
                    var sqlOorderDetailsParam = [order.insertId, item.product_id, item.quantity, item.price];
                    const orderDetail = await db.query(sqlOorderDetails,sqlOorderDetailsParam)

                    // cut stock from table product
                    var sqlProdut = "UPDATE product SET quantity=(quantity-?) WHERE product_id = ?"
                    var updatePro = await db.query(sqlProdut,[item.quantity,item.product_id])
                })

                // clear cart by customer
                await db.query("DELETE FROM cart WHERE customer_id = ?",[customer_id])
            
                res.json({
                    message:"Your order has been successfully!",
                    data:order
                })
                
                db.commit();
            }else{
                res.json({
                    message:"You cart is empty!",
                    error:true
                })
            }
        }else{
            res.json({
                error:true,
                message:"Please your address!"
            })
        }

        // gender invoice_no ? INV0001 , INV0002
        // select adress customer,
        // get cart by customer,
        // find total 
        // insert order 
        // insert order_detail
        // update stock product table 
        // clear cart


        // // order_detail
        // order_id ?
        // get cart by customer => (product_id,quantity,price)
    }catch(e){
        db.rollback();
        res.json({
            message:e,
            error:true
        })
    }
    
}

const update = (req,res) => {}
const remove = (req,res) => {}

module.exports = {
    getAll,getOne,update,remove,create,getOderByCustomer
}