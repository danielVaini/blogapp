const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const Usuario = mongoose.model('usuarios')

router.get('/registro', (req, res) => {
  res.render('usuarios/registro')
})

router.post('/registro', (req, res) => {
  let erros = [];

  if(!req.body.nome) {
    erros.push({texto: 'Nome inválido'})
  }
  if(!req.body.email) {
    erros.push({texto: 'Email inválido'})
  }
  if(!req.body.senha) {
    erros.push({texto: 'Senha inválida'})
  }
  if(req.body.senha.length < 4) {
    erros.push({texto: 'Senha muito curta'})
  }
  if(req.body.senha != req.body.senha2) {
    erros.push({texto: 'Senha não confere'})
  }


  if(erros.length > 0){
    
    res.render('usuarios/registro', {erro: erros})

  }else {
    // Na proxima aula!
  }
})

module.exports = router;