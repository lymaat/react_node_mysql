const express = require("express") // import 
const app = express() // extend express
const cors = require("cors")
 
// allow origin (npm i cors)
app.use(cors({ //fixed "has been blocked by CORS policy" from client
    origin:"*"
}))

app.use(express.json())
app.get("/",(req,res)=>{ res.send("Hello API")})


// just import all
const category = require("./src/route/category.route") // import
const product = require("./src/route/product.route")
const employee = require("./src/route/employee.route")
const customer = require("./src/route/customer.route")
const wishlist = require("./src/route/wishlist.route")
const order_status = require("./src/route/order_status.route")
const payment_method = require("./src/route/payment_method.route")
const cart = require("./src/route/cart.route")
const order = require("./src/route/order.route")

// call
category(app,"/api/category")
product(app,"/api/product")
employee(app,"/api/employee")
customer(app,"/api/customer")
wishlist(app,"/api/wishlist")
payment_method(app,"/api/payment_method")
order_status(app,"/api/order_status")
cart(app,"/api/cart")
order(app,"/api/order")

app.listen(8081,()=>{
    console.log("http localhost:8081")
})