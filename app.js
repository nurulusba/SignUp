const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');

const app = express();

function show() {
    const buf = Buffer.alloc(10, 1);
    const name = Buffer.from('Hello');
    console.log(name.toString);
    return;
}
 show();
// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  options= {
    url: 'https://us10.api.mailchimp.com/3.0/lists/19e54bb5eb',
    method: 'POST',
    headers: {
      Authorization: 'auth 53e235471f5021baaa5764ce861bdd33-us10'
    },
    body: postData
  };

  request(options, (err, response, body) => {
      if(err) {
          res.redirect('/fail.html')
      }
      else {
          if(response.statusCode === 200) {
              res.redirect('/success.html')
          }
          else {
              res.redirect('/fail.html');
          }
      }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));