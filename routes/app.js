const express = require('express');
const router = express.Router();
const books = require('google-books-search');
const isLoggedIn = require('../util').isLoggedIn;
const Book = require('../models/book');
const Trade = require('../models/trade');
const User = require('../models/user');

router.get('/', (req, res) => {
  if (req.user) {

    Book.find({ _user: { $ne: req.user._id }})
      .populate('_user')
      .exec((err, books) => {
        if (err) throw err;

        res.render('index.html', { books });
      });
  } else {
    Book.find({}, (err, books) => {
      if (err) throw err;

      res.render('index.html', { books });
    });
  }
});

router.get('/my-books', isLoggedIn, (req, res) => {
  Book.find({ _user: req.user._id }, (err, books) => {
    if (err) throw err;
    
    res.render('my-books.html', { books });
  });
});

router.get('/post-book', isLoggedIn, (req, res) => res.render('post-book.html'));

router.post('/post-book', isLoggedIn, (req, res) => {
  const { q } = req.body;
  
  if (!q) return res.redirect('/post-book');
  
  books.search(q, function(err, results) {
    if (err) {
      console.log(err);
      res.redirect('/post-book');
    } else {
      const newBook = new Book({
        _user: req.user._id,
        title: results[0].title,
        image: results[0].thumbnail
      });
      
      newBook.save(err => {
        if (err) throw err;

        res.redirect('/my-books');
      });
    }
  });
});

router.get('/remove-book/:bookId', isLoggedIn, (req, res) => {
  Book.findByIdAndRemove(req.params.bookId, (err, result) => {
    if (err) throw err;
    
    res.redirect('/my-books');
  });
});

router.get('/trades', isLoggedIn, (req, res) => {
  Trade.find({ _user2: req.user._id, isApproved: false })
    .populate('_book1 _book2 _user1 _user2')
    .exec((err, trades) => {
      if (err) throw err;
      
      res.render('trades.html', { trades });
    });
});

router.get('/trade/:bookId', (req, res) => {
  Book.findById(req.params.bookId, (err, book) => {
    if (err) throw err;
    
    Book.find({ _user: req.user._id }, (err, books) => {
      if (err) throw err;
      
      res.render('trade.html', { book, myBooks: books });
    })
  });
});

router.get('/trade/request/:book1Id/:book2Id', isLoggedIn, (req, res) => {
  Book.findById(req.params.book1Id, (err, book) => {
    if (err) throw err;
    
    const newTrade = new Trade({
      _book1: req.params.book1Id,
      _book2: req.params.book2Id,
      _user1: req.user._id,
      _user2: book._user
    });

    newTrade.save(err => {
      if (err) throw err;

      res.redirect('/trades');
    });
  });
});

router.get('/trade/accept/:tradeId', isLoggedIn, (req, res) => {
  Trade.findByIdAndUpdate({ _id: req.params.tradeId }, { isApproved: true }, (err, trade) => {
    if (err) throw err;

    Book.findByIdAndUpdate(trade._book1, { _user: trade._user2 }, (err, result) => {
      if (err) throw err;
      
      Book.findByIdAndUpdate(trade._book2, { _user: trade._user1 }, (err, result) => {
        if (err) throw err;
        
        res.redirect('/trades');
      });
    });
  });
});

router.get('/trade/reject/:tradeId', (req, res) => {
  Trade.findByIdAndRemove(req.params.tradeId, (err, result) => {
    if (err) throw err;
    
    res.redirect('/');
  });
});

router.get('/profile', isLoggedIn, (req, res) => res.render('profile.html'));

router.post('/profile', isLoggedIn, (req, res) => {
  const { firstname, lastname, city, state } = req.body;
  const updateObj = { firstname, lastname, city, state };
  
  User.findByIdAndUpdate(req.user._id, updateObj, (err, result) => {
    if (err) throw err;
    
    res.redirect('/profile');
  });
});

module.exports = router;