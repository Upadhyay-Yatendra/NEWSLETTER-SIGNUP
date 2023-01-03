const express = require('express');

const bodyParser = require('body-parser');

const request = require('request');

const https = require('https');
const { prototype } = require('events');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    
    const FirstName = req.body.first_name;
    const LastName = req.body.last_name;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: FirstName,
                    LNAME: LastName
                }
            }


        ]
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us10.api.mailchimp.com/3.0/lists/4c1421e7d0';

    const options = {
        method: 'POST',
        auth: "YATENDRA:cbbce35b9bd598c8b85e74f5ecec8a73-us10"
    }

    const request = https.request(url, options, function (response) {
       
       if( response.statusCode === 200 )
       {
            res.sendFile(__dirname+ "/success.html")
       }
       else
       {
            res.sendFile(__dirname + "/failure.html");
       }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res)
{
    res.redirect("/");
})




app.listen(3000 || process.env.PORT , () => console.log("SERVER RUNNING AT PORT 3000"));


// api_key = cbbce35b9bd598c8b85e74f5ecec8a73-us10
// list id = 4c1421e7d0;