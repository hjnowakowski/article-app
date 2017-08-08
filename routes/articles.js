const express = require('express');
const router = express.Router();

//bring in Article model
let Article = require('../models/article');

// User model
let User = require('../models/user');


//Add route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});

//Add submit POST route

router.post('/add', (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty();
  //req.checkBody('author', 'Author is required').notEmpty();
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
    article.author = req.user._id;
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
router.get('/edit/:id', ensureAuthenticated, (req, res) =>{
  Article.findById(req.params.id, (err, article)=>{
    if(article.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
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

// Delete article

router.delete('/:id', (req, res)=>{
if(!req.user._id){
  res.status(500).send();
}

  let query = {_id:req.params.id}
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    }else{
      Article.remove(query, (err)=>{
        if(err) console.log(err);
        res.send('Success');
      })
    }
  });
});

// Get Single Article
router.get('/:id', (req, res) =>{
  Article.findById(req.params.id, (err, article)=>{
    User.findById(article.author, function(err, user){
      console.log(article.author, user);
      res.render('view_article', {
        article: article,
        author: user.name
      });
    });
  });
});

//TODO: add author to get single article function

// access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please Login');
    res.redirect('/users/login');
  }
}

module.exports = router;
