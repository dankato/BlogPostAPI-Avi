'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const {BlogPosts} = require('../models');

const router = Router();

router.use(jsonParser);
// jsonParser is a piece of middleware that we supply as a second argument to our route handler below.


router.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});
// When a request is made to /blog-posts, our app responds by serializing 
// (that is, transforming to JSON) the data returned by BlogPosts.get(), 
// which will be a list of the current blog post items.


router.post('/blog-posts', jsonParser, (req, res) => {
  // Creating POST endpoints, 1.4.3
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  // first validate the request body, ensuring that title, content, author and date have been supplied.
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    // If these values are missing, we log an error and send back a status code 400, along with a helpful error message.
    if (!(field in req.body)) {
      const message = `Yo, missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  // If the client has sent valid data, we call BlogPosts.create with data from the request body.
  // create() returns the newly created item, 
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  // and we respond by sending a 201 status code, along with a JSON object representing the new item.
  res.status(201).json(item);
});


router.delete('/blog-posts/:id', (req, res) => {
    // Creating DELETE endpoints, 1.4.4
  // We retrieve the id of the item to be deleted from the request params & call BlogPosts.delete with value.
  BlogPosts.delete(req.params.id);
  // We send back a blank response with a 204 status code.
  console.log(`Deleted blog post item \`${req.params.id}\``);
  res.status(204).end();
});

router.put('/blog-posts/:id', jsonParser, (req, res) => {
    // Creating PUT endpoints, 1.4.5
    // using the jsonParser middleware to parse the request body.
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    // validating the data to ensure 
    // a.) that the required fields have been sent, and 
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
    // b.) that the id values in the request body and request path URL match.
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  // If the request is valid, this endpoint calls BlogPosts.update() with the updated data
  console.log(`Updating blog post item ${req.params.id}`);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  // If successful, endpoint returns a 204 HTTP status code, along with a JSON object representing the updated item.
  res.sendStatus(204);
});

// what is returned from this specific file, which is the results from Router();
module.exports = router;