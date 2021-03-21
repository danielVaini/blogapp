// Carregando modulos
  const express = require('express');
  const handlebars = require('express-handlebars');
  const app = express();
  const admin = require('./routes/admin');
  const path = require('path')
  const mongoose = require('mongoose')

  
  // Configuração
    // Body-parser
      app.use(express.urlencoded({extended: true}))
      app.use(express.json())
    // Handlebars
      app.engine('handlebars', handlebars({defaultLayout: 'main'}))
      app.set('view engine', 'handlebars')
    // Mongoose
    mongoose.connect("mongodb://localhost/blogapp").then(() => {
      console.log('Mongo conected')
    }).catch((err) => {
      console.log(err)
    })

    mongoose.Promise = global.Promise;
      // Em breve
    // Public
      app.use(express.static(path.join(__dirname, 'public')))

// Rotas
  app.use('/admin', admin)

// Outros
  const PORT = 3333;
  app.listen(PORT, () => {
    console.log('Connected')
  })