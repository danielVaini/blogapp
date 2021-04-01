const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Categoria = mongoose.model('categorias');

router.get('/', (req, res) => {
  res.render('admin/index')
})

router.get('/posts', (req, res) => {
 
  
})

router.get('/categorias', (req, res) => {
  Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
    res.render('admin/categorias', {categoria: categorias})
  }).catch((error) => {
    req.flash("error_msg", "Houve um erro ao listar as categorias")
    res.redirect("/admin")
  })
})

router.get('/categorias/add', (req, res) => {
  res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {

  const errors = [];

  // Campo nome vázio ou inválido

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
      errors.push({texto: 'Nome inválido'})
    }
  // Campo slug vázio ou inválido
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
      errors.push({texto: 'Slug inválido'})
    }
  // campo slug < 2
    if(req.body.slug.length < 2 || req.body.nome.length < 2) {
      errors.push({texto: 'Nome slug muito pequeno'})
    }

  // Error
    if(errors.length > 0) {
      res.render('admin/addcategorias', {error: errors});
    }else {

      const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
      }
    
      new Categoria(novaCategoria).save().then(() => {
        req.flash('success_msg', 'Categoria criada com sucesso')
        res.redirect('/admin/categorias')
      }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente')
        res.redirect('/admin')
      })
    }
})

router.get('/categorias/edit/:id', (req, res) => {
  res.send('Página de edição de categoria')
})

module.exports = router;