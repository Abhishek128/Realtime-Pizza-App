const order = require("../../../models/order")

function orderController(){
    return {
        index(req,res){
            order.find({status :{$ne : "completed"}},null,{sort:{'createdAt' : -1}}).populate('customerId','-password').exec((err,orders) => {
                // console.log(req.xhr)
                if (req.xhr){
                    // console.log(res.json(orders))
                    return res.json(orders)
                }else{
                    console.log('...................')
                    return res.render('admin/orders')
                }
            })
        }
    }
}

module.exports  = orderController