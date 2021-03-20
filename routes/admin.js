const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Main page of admin painel")
})

router.get('/posts', (req, res) => {
  res.send('Post page')
})

router.get('/categorias', (req, res) => {
  res.send('Category page')
})


module.exports = router;