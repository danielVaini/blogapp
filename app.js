// Carregando modulos
  const express = require('express');
  const handlebars = require('express-handlebars');
  const app = express();
  const admin = require('./routes/admin');
  const path = require('path');
  const mongoose = require('mongoose');
  const session = require('express-session');
  const flash = require('connect-flash');
  // models
    require('./models/Postagem');
    const Postagem = mongoose.model('postagens')
    require('./models/Category');
    const Categoria = mongoose.model('categorias')
  
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

  app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
      if(postagem){
        res.render('postagem/index', {postagem: postagem})
      }else {
        req.flash('error_msg', 'Esta postagem não existe')
        res.redirect('/')
      }
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro interno')
      res.redirect('/')
    })
  })

  app.get('/categorias', (req, res) => {
    Categoria.find().lean().then((categorias) => {
      res.render('categorias/index', {categorias})
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro interno ao listar as categorias')
      res.redirect('/')
    })
  })
  
  app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
      if(categoria){
        
        Postagem.find({categoria: categoria._id}).lean().then((postagem) => {
          res.render('categorias/postagens', {postagem,categoria})
        }).catch((err) => {
          req.flash('error_msg', 'Houve um erro ao listar os posts')
          res.redirect('/')
        })

      }else {
        req.flash('error_msg', 'Essa categoria não existe')
        res.redirect('/')
      }
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao carregar a página dessa categoria')
      res.redirect('/')
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