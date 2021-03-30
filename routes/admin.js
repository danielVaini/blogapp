const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Categoria = mongoose.model('categorias');

router.get('/', (req, res) => {
  res.render('admin/index')
})

router.get('/posts', (req, res) => {
  res.send('Post page')
})

router.get('/categorias', (req, res) => {
  res.render('admin/categorias')
})

router.get('/categorias/add', (req, res) => {
  res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {
  const novaCategoria = {
    nome: req.body.nome,
    slug: req.body.slug
  }

  new Categoria(novaCategoria).save().then(() => {
    console.log("Save category with sucess")
  }).catch((err) => {
    console.log("Erro ao salvar categoria:" + err)
  })
})


module.exports = router;