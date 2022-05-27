require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const mongoConnect = require('./config/mongoose.config');
const session = require('express-session');
const authRouter = require('./routes/auth.route');
const setRouter = require('./routes/set.route');
const createRouter = require('./routes/create.route');
const cardsRouter = require('./routes/card.route');
const foldersRouter = require('./routes/folder.route');
const MongoStore = require('connect-mongo');
const passport = require('passport')
const cors = require('cors');

const app = express();
const PORT=process.env.PORT || 8000;
mongoConnect();


const sessionStore = MongoStore.create({
    client: mongoose.connection.getClient(),
    collectionName: "sessions"
})

app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie:{
        maxAge: 1000 * 60 * 60,
    }
}))

require('./config/auth-local.config');
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/set", setRouter);
app.use("/create", createRouter);
app.use("/cards", cardsRouter);
app.use("/folders", foldersRouter);


mongoose.connection.once("open", ()=>{
    // mongoose.connection.db.collection('sessions').deleteMany({})
    console.log("Connected to database");
    app.listen(PORT, ()=>{
        console.log('Server is running on port '+ PORT);
    });
})

