const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');

// express app
const app = express();

// connect to mongoDB
const dbURI =
  'mongodb+srv://joedo249:Varuna03db@cluster0.c8t4v.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// mongoose and mongoDB sandbox routes
// app.get('/add-blog', (req, res) => {
//   const blog = new Blog({
//     title: 'new blog 2 ',
//     snippet: 'about my new blog 2 ',
//     body: 'more about my new blog 2',
//   });
//   blog
//     .save()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => console.log(err));
// });

// views
app.get('/', (req, res) => res.redirect('/blogs'));

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

//blog routes
app.get('/blogs', (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render('index', { title: 'All Blogs', blogs: result });
    })
    .catch((err) => console.log(err));
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => res.redirect('/blogs'))
    .catch((err) => console.log(err));
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch((err) => console.log(err));
});

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: '/blogs' });
    })
    .catch((err) => console.log(err));
});

app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
