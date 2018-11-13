const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

// API routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app);

app.get('/ping', (req, res, next) => {
  res.send('pong');
  next();
});

const port = process.env.PORT || 3000;

// Start your app.
app.listen(port, (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log(
    `
    ################################  
    # Bringg server started        #
    # Port: ${port}                   #
    ################################
    `);
  }
});
