// Import Modules
const express = require('express');
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express');
const app = express();

// Use installed packages
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

// Routes for application 
app.use('/',require('./routes/index'))
app.use('/about-us', require('./routes/about'))
app.use('/help', require('./routes/help'))
app.use('/contact-us', require('./routes/contact'))

// set up port
app.listen(4000, () => 

{
 console.log('Server started on port 4000. Ctrl^c to quit.');
});