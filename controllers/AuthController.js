const User = require('../models/User')

const bcrypt = require('bcryptjs')



module.exports = class AuthController{

        static login(req,res){
            res.render('auth/login')
        }

        static async loginPost(req,res){
            const {email ,password} = req.body

            //finder User
            const user = await User.findOne({where : {email: email}})
            
            if(!user){
                req.flash('message', `User wasn't found!`)
                res.render('auth/register')

                return
            }

            //check if password machts
            const passwordMatch = bcrypt.compareSync(password, user.password)
            if(!passwordMatch){
                req.flash('message', `Password is wrong!`)
                res.render('auth/register')

                return
            }

            //Initialize session
            req.session.userid = user.id
            req.flash('message', `Welcome ${user.name}  id: ${user.id}!`)
            req.session.save(()=>{
                
                res.redirect('/')
            })
        

        }
       
        static register(req,res){
            res.render('auth/register')
        }
        
        static async registerPost(req, res){
            

            //Here we make the validation

            // We take an object of all data from the Register
            const {name, email, password, confirmpassword} = req.body

            // Here we make the password validation

            if(password != confirmpassword){
                //We use the flash messagem for the front end
                req.flash('message', 'The passwords Dismatchs')
                res.render('auth/register')
                return
            }

            // check if user exists

            const checkIfUserExist = await User.findOne({where : {email: email}})
            if(checkIfUserExist){
                req.flash('message', 'The email has already been used')
                res.render('auth/register')
                
                return
            }

            // create a password

            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(password,salt)

            const user = {
                name,
                email,
                password: hashedPassword // we send a crypted password 
            }
            try{
            
            const createdUser = await User.create(user)
            
            // initialize session
            req.session.userid = createdUser.id
            req.flash('message', `User created sucessfully`)
            
            //Here we save the session before the user been redirected
            req.session.save(()=>{
                
                res.redirect('/')
            })
            
            
            
            }catch(err){
                console.log(err)
                req.flash('message', `I wasn't possible to create the user`)
            }

            
        }
        static async logout(req, res){
                req.session.destroy() //We destroy the session
                res.redirect('/') 
        }

       
}