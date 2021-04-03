// Carregando modulos
  const express = require('express');
  const handlebars = require('express-handlebars');
  const app = express();
  const admin = require('./routes/admin');
  const path = require('path');
  const mongoose = require('mongoose');
  const session = require('express-session');
  const flash = require('connect-flash');
  require('./models/Postagem');
  const Postagem = mongoose.model('postagens')

  
  // Configuração
    // Session
      app.use(session({
        secret: "cursodenode",// Chave para gerar uma sessão para nós
        resave: true,
        saveUninitialized: true,

      }))

      app.use(flash());
    
    // Midlleware
      app.use((req, res, next) => {
        // Permite criar variiáveis globais
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");

        next();
      } )
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
  app.get('/', (req, res) => {
    Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
      res.render('index', {postagens: postagens})

    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao listar as postagens')
      res.redirect('/404')
    })
  })

  app.get('/404', (req, res) => {
    res.send('Error 404!')
  })

  app.use('/admin', admin)

// Outros
  const PORT = 3333;
  app.listen(PORT, () => {
    console.log('Connected')
  })