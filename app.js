const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const authentication = require("./configs");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  const firstName=req.body.fName;
  const lastName=req.body.lName;
  const email=req.body.mailid;

  const data={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  var jsonData=JSON.stringify(data);

  const url=authentication.url;
  const options={
    method: "POST",
    auth: authentication.auth
  }

  const request = https.request(url, options, function(response){
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
  // console.log(firstName, lastName, email);
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){ //process.env.PORT for Heroku
  console.log("server is running on port 3000");
});


//0b2a5cc520
//e63f475f745448f9dcad9ded4afefbf0-us7
