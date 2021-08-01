const User = require('../../models/user')
const bcryt = require('bcrypt')
const passport = require('passport')
function authController(){
    
    return {
        login(req,res){
            return res.render('auth/login')
        },
        postlogin(req,res,next){
            const { email, password }   = req.body
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local',(err,user,info)=>{
                console.log(info)
                console.log(err)
                if (err) {
                    console.log(info)
                    req.flash('error',info.message)
                    return next(err)
                }
                if (!user){
                    console.log(info)
                    console.log(err)
                    console.log(info.message)
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }
                req.logIn(user,(err)=>{
                    if (err) {
                        req.flash('error',info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req,res,next)
        },
        register(req,res){
            return res.render('auth/register')
        },
        async postregister(req,res){
            const {name,email,password} = req.body
            // console.log(req.body)
            if (!name || !email || !password){
                req.flash('error','All Feilds Required')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }
            User.exists({email : email},(err,result)=>{
                if (result) {
                    req.flash('error','Already a registered User')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
                }
            })
            // Hash Password 
            const hashedPassword = await bcryt.hash(password,10)
            const user = new User({
                name : name , 
                email : email , 
                password : hashedPassword
            })
            
            user.save().then((user) => {
                return res.redirect('/')
            }).catch(err => {
                req.flash('error','Something went wrong')
                return res.redirect('/register')
            })
        },
        logout(req,res){
            req.logout()
            return res.redirect('/login')
        }

    }
}

module.exports = authController