
const express = require('express')
require('dotenv').config() // init dotenvs
const morgan = require('morgan')
const helmet = require('helmet')
const mongoConfig = require('./config/mongoConfig')
const todosRouter = require('./routes/todoRouter')
const usersRouter = require('./routes/usersRouter')
const authRouter = require('./routes/authRouter')

const app = express()
const PORT = 8000

//* middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())

//* Routers
app.use('/todos', todosRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.status(200).json("Welcome to my API!")
})



app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    mongoConfig()
})