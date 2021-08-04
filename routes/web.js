const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

function initRoutes(app){
    app.get('/', homeController().index)
    app.get('/cart',cartController().index)
    app.get('/login',guest,authController().login)
    app.post('/login',authController().postlogin)
    app.get('/register',guest,authController().register)
    app.post('/register',authController().postregister)
    app.post('/logout',authController().logout)
    app.post('/update-cart',cartController().update)
    app.post('/orders',auth,orderController().store)
    app.get('/customer/order',auth,orderController().index)
    app.get('/customer/order/:id', auth, orderController().show)
    app.get('/admin/orders',admin,AdminOrderController().index)
    app.post('/admin/order/status',admin,statusController().update)
}

module.exports = initRoutes 