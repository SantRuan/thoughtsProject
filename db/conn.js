const {Sequilize, Sequelize} = require('sequelize')

const sequelize = new Sequelize('thoughts','root', 'r2d21r2d21',
{
    host: 'localhost',
    dialect:'mysql'
})

try{
    sequelize.authenticate()
    console.log('conectado ao DB')
}
catch(err){
    console.log(err)
}

module.exports = sequelize