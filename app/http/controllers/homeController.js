const menu = require('../../models/menu')

function homeController(){
    
    return {
        async index(req,res){
            const pizzas  = await menu.find()
            // console.log(pizzas)
            return res.render('home',{pizzas : pizzas})
            // menu.find().then(function(pizzas){
                // console.log(pizzas)
            //     return res.render('home',{pizzas : pizzas})
            // })
            // return res.render('home')
        }
    }
}

module.exports = homeController