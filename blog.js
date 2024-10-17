const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Client } = require('pg');  
const PORT = 5050;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'BlogDB',
  password: '',
  port: 5432
});

client.connect(err => {
    if (err) {
      console.error('Connection error', err.stack);
    } else {
      console.log('Connected to the database');
    }
  });
  
app.get('/', (req, res) => {
  res.redirect('/login');
});

  
app.get('/login', (req, res) => {
  res.render('pages/login'); 
});

app.post('/login', async (req, res) => {
    const { user_id, password } = req.body;
      const result = await client.query('SELECT * FROM users WHERE user_id = $1 AND password = $2', [user_id, password]);
  
      if (result.rows.length > 0) {
        res.redirect('/home');
      } else {
        res.render('pages/login', { error: 'Invalid user_id or password' });
      }
  });
  

app.get('/home', async (req, res) => {
    const result = await client.query('SELECT * FROM blogs ORDER BY date_created DESC');
    res.render('pages/home', { posts: result.rows }); 
});

app.get('/signup', (req, res) => {
    res.render('pages/signUp');  
  });
  
  app.post('/signup', async (req, res) => {
    const { user_id, password, name } = req.body;
      await client.query(
        'INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)',
        [user_id, password, name]
      );
      
      res.redirect('/login');

  });

app.get('/post', (req, res) => {
  res.render('pages/post'); 
});

app.post('/post', async (req, res) => {
  const { author, title, body } = req.body;
    await client.query(
      'INSERT INTO blogs (title, body, creator_name, date_created) VALUES ($1, $2, $3, NOW())',
      [title, body, author]
    );
    res.redirect('/home'); 

});

app.post("/delete/:id", async (req, res) => {
    await client.query('DELETE FROM blogs WHERE blog_id = $1', [req.params.id]);
    res.redirect('/home');
});

app.get('/edit/:id', async (req, res) => {
  const postId = req.params.id;
    const result = await client.query('SELECT * FROM blogs WHERE blog_id = $1', [postId]);
    res.render('pages/editPost', { post: result.rows[0] });
});

app.post('/edit/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, body } = req.body;
    await client.query(
      'UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3',
      [title, body, postId]
    );
    res.redirect('/home');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
