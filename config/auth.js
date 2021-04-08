const localStratefy = require('passport-local').Strategy;
const moongose = require('mongoose')
const bcrypt = require('bcryptjs')

//model user
require('../models/User');
const Usuario = moongose.model('usuarios');

module.exports = function (passport) {
  passport.use(new localStratefy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
    Usuario.findOne({email: email}).then((usuario) => {
      if(!usuario){
        return done(null, false, {message: "Está conta não existe"})
      }

      bcrypt.compare(senha, usuario.senha, (erro, batem) => {

        if(batem){
          return done(null, usuario)
        }else {
          return done(null, false, {message: 'Senha e/ou email incorretos'})
          
        }

      })

    })
  }))

  // Salvando dados na sessão 

  passport.serializeUser((user,done) => {

    done(null, user.id)

  })

  passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, usuario) => {
      done(err, usuario)
    })
  })
}