const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
var cors = require('cors');

const port = process.argv[2]

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

require('./app/routes')(app, {});

app.listen(port, () => {
  console.log('We are live on ' + port);
});
