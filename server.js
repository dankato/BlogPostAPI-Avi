const express = require('express');
const morgan = require('morgan');
const {BlogPosts} = require('./models');


const app = express();
const router = require('./routes/router');

app.use(morgan('common'));
app.use('/', router);
console.log(router.stack);

// dummy posts
BlogPosts.create('horse','test','saule');
BlogPosts.create('milk','test','Sandy');

app.listen(process.env.PORT  || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});