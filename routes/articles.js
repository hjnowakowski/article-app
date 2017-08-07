const express = require('express');
const router = express.Router();

//bring in Article model
let Article = require('../models/article');


//Add route
router.get('/add', function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
})

//Add submit POST route

router.post('/add', (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();


  //get errors

  let errors = req.validationErrors();
  if(errors){
    res.render('add_article', {
      title: 'Add Article',
      errors: errors
    });
  }else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save( (err) => {
      if(err) console.log(err);
      else{
        req.flash('success', 'article added')
        res.redirect('/')
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', (req, res) =>{
  Article.findById(req.params.id, (err, article)=>{
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
    console.log(article);
    return;
  });
});

// Update Submit Post route
router.post('/edit/:id', (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body

  let query = {_id:req.params.id}

  Article.update(query, article, (err) => {
    if(err) console.log(err);
    else{
      req.flash('success', 'article updated');
      res.redirect('/')
    }
  });
});

router.delete('/:id', (req, res)=>{
  let query = {_id:req.params.id}

  Article.remove(query, (err)=>{
    if(err) console.log(err);
    res.send('success');
  })
});

// Get Single Article
router.get('/:id', (req, res) =>{
  Article.findById(req.params.id, (err, article)=>{
    res.render('view_article', {
      article: article
    });
    console.log(article);
    return;
  });
});

module.exports = router;
