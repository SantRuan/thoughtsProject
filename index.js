const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express()

const routePlace = 3000
const conn = require('./db/conn')
//Importing Routes
const thoughtsRoutes = require('./routes/thoughtsRoutes')
const authRoutes = require('./routes/authRoutes')

//Controller
const ThoughtController = require('./controllers/ThoughtsController')
// Model
const Thought = require('./models/Thought')
const User = require('./models/User')
//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')



//receber resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
)

//Middleware que nos permite receber dados em json
app.use(express.json())

// Middleware que nos tem a função de salvar as sessões
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false, // Se a sessão cair o user será desconectado,
        saveUnitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'), // Esse core module diz ao sistema que a session terá um


        }),
        cookie: { // É necessário a configuração de um Cookie
            // para fazer a coneção do user
            secure: false,
            maxAge: 3600000, //tempo de duração
            expires: new Date(Date.now() + 360000),// Força a expiração em 1 dia
            httpOnly: true // Como estamos trabando apenas com localhost e não com https, essa variável torna-se true
        }

    })
)

// flash messages
app.use(flash())

// public path
app.use(express.static('public'))

// Salvar a sessão na resposta set session to res
app.use((req,res,next)=>{

    console.log(req.session.userid);
    if(req.session.userid){ // caso o usuário não esteja logado esse if passa em branco
        res.locals.session = req.session //se usuário estiver logado mandamos a sessão da requisição para resposta 
        // assim, ascessamos no front end para seguir com os dados dele

    }

    next()
})

//Routes

app.use('/thoughts',thoughtsRoutes)
app.use('/', authRoutes )
app.use('/',ThoughtController.showThoughts)

// conn.sync({force : true}).then(() => { para reiniciar o banco de dados com as relações
conn.sync().then(() => {
    app.listen(routePlace)
}).catch((err) => console.log(err)) 