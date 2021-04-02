const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Model categorias
require('../models/Category');
const Categoria = mongoose.model('categorias');
// Model postagens
require('../models/Postagem');
const Postagem = mongoose.model('postagens')

router.get('/', (req, res) => {
  res.render('admin/index')
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
  Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
    res.render('admin/editcategorie', {categoria: categoria})
  }).catch((err) => {
    req.flash("error_msg", "Essa categoria não existe")
    res.redirect('/admin/categorias')
  })
})

router.post('/categorias/edit', (req, res) => {
  const errors = [];
  if(!req.body.nome || req.body.nome == undefined || req.body.nome == null){
    errors.push({texto: "verifique o campo (NOME)"})
  }
  
  if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
    errors.push({texto: "verifique o campo (SLUG)"})
    
  }
  
  if(errors.length > 0){
    res.render(`admin/addcategorias`, {error: errors})
  }else{   
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
      // Fazer sistema de validação
      categoria.nome = req.body.nome;
      categoria.slug = req.body.slug;
      
      categoria.save().then(() => {
        req.flash("success_msg", "Categoria editada com sucesso")
        res.redirect("/admin/categorias")
      }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno ao salvar a ediçaõ da categoria')
        res.redirect('/admin/categorias')
      })
      
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao editar a categoria")
      res.redirect('/admin/categorias')
    })
  }
})

router.post("/categorias/deletar", (req, res) => {
  Categoria.remove({_id: req.body.id}).then(() => {
    req.flash('success_msg', "Categoria deletada com suceso")
    res.redirect("/admin/categorias")
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao deletar a categoria")
    res.redirect('/admin/categorias')
  })
})

router.get('/postagens', (req, res) => {
  Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
    res.render("admin/postagens", {postagens: postagens})
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro a listar as postagens")
    res.redirect('/admin')
  })
})

router.get('/postagens/add', (req, res) => {
  Categoria.find().lean().then((categorias) => {
    res.render('admin/addpostagem', {categorias: categorias})
  }).catch((err) => {
    req.flash('error_msg', "Houve um erro ao carregar o formulário")
    res.redirect('/admin')
  })
})

router.post('/postagens/nova', (req, res) => {
  const errors = []

  if(req.body.categoria == "0"){
    errors.push({texto: "Categoria inválida, registre uma categoria"})
  }

  if(errors.length > 0) {
    res.render('admin/addpostagem', {errors: errors})
  }else {
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug,
    }

    new Postagem(novaPostagem).save().then(() => {
      req.flash('success_msg', "Postagem criada com sucesso")
      res.redirect('/admin/postagens')
    }).catch((err) => {
      req.flash('error_msg', "houve um erro durante o salvamento da postagem")
      res.redirect('/admin/postagens')
    })
  }
})
module.exports = router;