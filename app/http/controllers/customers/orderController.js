const Order = require('../../../models/order')
const moment = require('moment')
function orderController(){
    return {
        store(req,res){
            const{phone,address} = req.body
            if (!phone || ! address) {
                req.flash('error','All field are required')
                return res.redirect('/cart')
            }
            const order = new Order({
                customerID : req.user._id ,
                items : req.session.cart.items ,
                phone : phone , 
                address : address , 
            })
            order.save().then(result =>{
                Order.populate(result,{path: 'customerID'},(err,placedOrder) =>{
                    req.flash('success' , 'Order Placed Sucessfully')
                    delete req.session.cart
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced',placedOrder)
                    return res.redirect('/customer/order')
                })
                
            }).catch(err =>{
                req.flash('error','Something Went Wrong ')
                return res.redirect('/cart')
            })
        },
        async index(req,res){
            // console.log(req.user)
            // console.log(req.user._id)
            const orders = await Order.find({ customerID : req.user._id},null,{sort:{'createdAt':-1}})
            // console.log(orders)
            res.render('costomer/order',{orders:orders,moment:moment})
        } ,
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // console.log(order.customerID)
            // Authorize user
            if(req.user._id.toString() === order.customerID.toString()) {
                return res.render('costomer/singleOrder', { order })
            }
            return  res.redirect('/')
            // return res.redirect('/customer/order')
        }
    }
} 

module.exports = orderController