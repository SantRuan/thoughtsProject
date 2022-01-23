const Thought = require('../models/Thought')
const User = require('../models/User')

//this Operator will help us to do the search in the 
// home

const {Op} = require('sequelize')
module.exports = class ThoughtController{

    static async showThoughts(req,res){

        

        let search = ''
        let order = 'DESC'

        if(req.query.search){
          search = req.query.search
        }

        if(req.query.order === 'old'){
          order = 'ASC'
        }
        else{
          order = 'DESC'
        }

         //Creating a search filter in a similar word as in the search field

        const thoughtsData = await Thought.findAll({include: User,
          where: {title:{[Op.like]:`%${search}%`}  // This is the filter to find similar word as typed in the search
          
        
        },order: [['createdAt',order]],
          })
       



        // plain -> makes the data be inside an array

        const thoughts = thoughtsData.map((result)=> result.get({plain:true}))
        const thoughtsQty = thoughts.length
        if(thoughtsQty === 0){
          thoughtsQty = false;
        }

        res.render('thoughts/home', {thoughts, search, thoughtsQty})
    }

    static async dashboard(req,res){

       const userId = req.session.userid

        const user = await User.findOne({where:{id: userId},
        include: Thought, //Here we bring all the User thought`s from database
        plain: true, // Here the the data will come as an array of data we need to make a data manipulation
        })

        if(!user){
            res.redirect('/login')
        }

        //Here we make a filter to collect the User Thoughts correctly
        const thought = user.thoughts.map((result)=>result.dataValues)
        
        let emptyThought = false

        if(thought.length === 0){
            emptyThought = true
        }

        res.render('thoughts/dashboard', {thought, emptyThought})
    }

    static async createThought(req,res){
        res.render('thoughts/create')
    }
    static async createThoughtSave(req,res){
        const thought = {
            title: req.body.title,
            UserId: req.session.userid //Remember is session.userid
        }


  
        

        
      try{

        await Thought.create(thought)
        req.flash('message', 'The thought was created sucessfuly')
        req.session.save(()=>{
            res.redirect('/thoughts/dashboard')
            
        })
        
      }
      catch(err){console.log(err)}
    }


    static async removeThought(req, res) {
        const id = req.body.id
        const UserId = req.session.userid
        
          try{
            await Thought.destroy({ where: { id: id , UserId: UserId} })
            req.flash('message', 'the thought was removed sucessfuly!')
            req.session.save(() => {
              res.redirect('/thoughts/dashboard')
            })
          }catch(err){console.log(err)}
      }


      static async updateThought(req, res){

        const id = req.params.id

        const thought = await Thought.findOne({where : {id: id}, raw: true})

        res.render('thoughts/edit', {thought})

      }
      static async updateThoughtSave(req,res){
        const id = req.body.id
        const thought = {title: req.body.title}

        try{
        await Thought.update(thought, {where:{id:id}})

        req.flash('message', 'the thought was updated sucessfuly!')
            req.session.save(() => {
              res.redirect('/thoughts/dashboard')
            })
        } catch(err){
          console.log(err)
        }
      }
}


