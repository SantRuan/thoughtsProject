const { DataTypes } = require('sequelize')

const db = require('../db/conn')
const User = require('./User')

//User
const Thought = db.define('thought',{

    title:{
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },


})
Thought.belongsTo(User)
User.hasMany(Thought)
module.exports  = Thought