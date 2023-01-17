const express = require('express');

const bodyParser = require('body-parser');

const request = require('request');

const https = require('https');

const { prototype } = require('events');

const app = express();

require('dotenv').config();

// console.log(process.env);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

    const FirstName = req.body.first_name;
    const LastName = req.body.last_name;
    const email = req.body.email;

    // HERE USING MAILBOXLAYER API TO VALIDATE ENTERED EMAIL

    // set endpoint and your access key


    fetch(`https://api.apilayer.com/email_verification/check?apikey=${process.env.validate_key}&email=${email}`)
        .then(resp => resp.json()
            // console.log(resp.mx_found);
            // if(!(resp.mx_found==='true'&&resp.format_valid==='true'&&resp.smtp_check==='true'))
            // {
            //     res.write("<h4>INVALID EMAIL ENTERED</h4>");

            // }
        ).then(data => {
      
            console.log(data);
            // console.log(data);
            //   console.log("\n");
            //   console.log(data.mx_found);
            //   console.log(data.smtp_check)
            var check1 = data.format_valid === true 
            var check2 = data.smtp_check === true
            var check3 = data.mx_found === true
            var valid = check1 && check2 && check3
            // console.log(check1);
            // console.log(check2);
            // console.log(check3);
            // console.log(valid);

            // console.log("\n\n\n" + Valid_email );
            if (!(valid)) {
                // console.log("CAME HERE TO THROW INVALID EMAIL FILE");
                res.sendFile(__dirname + "/invalid_email.html");
                // console.log("THREW THE FILE");
            }

            else {
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


                const url = `https://us10.api.mailchimp.com/3.0/lists/${process.env.list_key}`;
                const options = {
                    method: 'POST',
                    auth: `YATENDRA:${process.env.mailchimp_key}`
                }

                const request = https.request(url, options, function (response) {

                    if (response.statusCode === 200) {
                        res.sendFile(__dirname + "/success.html")
                    }
                    else {
                        console.log(response.statusCode);
                        res.sendFile(__dirname + "/failure.html");
                    }

                });
                request.write(jsonData);
                request.end();
            }

        });

    // HERE CREATING AN OBJECT TO STORE IN MAILCHIMP DATABASE


});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.post("/again", (req, res) => {
    res.redirect("/")
})




app.listen(3000 || process.env.PORT, () => console.log("SERVER RUNNING AT PORT 3000"));



// list id = 4c1421e7d0;