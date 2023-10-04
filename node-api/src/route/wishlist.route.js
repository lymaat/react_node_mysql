

const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/wishlist.controller")
const wishlist = (app,base_route) =>{
    app.get(`${base_route}`,userGuard,ct.getAll)
    app.post(`${base_route}`,userGuard,ct.create)
    app.delete(`${base_route}`,userGuard,ct.remove)
}
module.exports = wishlist;