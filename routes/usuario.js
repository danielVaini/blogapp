const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')

const passport = require('passport');

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
    Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
      if(usuario) {
        req.flash('error_msg', "Já exiiste uma conta com este email em nosso sitema")
        res.redirect('/usuarios/registro')
      }else {

        const novoUsuario = new Usuario({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha,
         
        })

        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
            if(erro){
              req.flash('error_msg', 'Houve um erro durante o salvamento do usuario')
              res.redirect('/')
            }

            novoUsuario.senha = hash;

            novoUsuario.save().then(() => {
              req.flash('success_msg', 'Usuário criado com sucesso')
              res.redirect('/')
            }).catch((erro) => {
              req.flash('error_msg', 'Houve um erro ao criar o usuário')
              res.redirect('/usuarios/registro')
            })
          })
        })


      }
    }).catch((err) => {
      req.flash('error_msg', "Houve um erro interno")
      res.redirect('/')
    })
  }
})

router.get('/login', (req, res) => {
  res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/usuarios/login',
    failureFlash: true,
  })(req, res, next)

})

module.exports = router;