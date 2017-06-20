/*jshint esversion:6 */
//home route, which is triggered when start the app.
let router = require("express").Router();
var fs = require("fs");
var catchSchema = require("../models/Catch.js");
var User = require("../models/User.js");
var db = require("../config/database.js");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var WebHooks = require('node-webhooks');
var xss = require('xss');
var webHooks = new WebHooks({
    db: './webHooksDB.json', // json file that store webhook URLs
});

router.route("/")
    .get(function(req, res) {
        res.json({size:"5",
                links:{
                  self: {href:"/api", method:"GET", desc:"Url to main entry point and current adress"},
                  catch:{href:"/api/catch", method:"GET", desc:"Url to catch entry point, describes all routes within catch"},
                  user:{href:"/api/user", method:"GET", desc:"Url to user entry point,describes all routes within user"},
                  auth:{href:"/api/auth", method:"POST", headers:{contenttype:"application/x-www-form-urlencoded",xaccesstoken:"{token}"},
                    body:{user:"{user}",pass:"{pass}"}, desc:"Url to auth against, don't forget to create a user first"},
                  webhook:{href:"/api/webhook", method:"GET", desc:"Url to webhook entry point, describes all routes within webhook"}
                }
        });

    });

router.route("/catch")
      .get(function(req, res) {
        res.json({
            size:"6",
            links:{
              self:{href:"/api/catch", method:"GET", desc:"Url to resources for catch, also is the current url"},
              add:{href:"/api/catch", method:"POST", headers:{contenttype:"application/x-www-form-urlencoded",xaccesstoken:"{token}"},
                  body:{name:"{name}",user:"{user}",posx:"{posx}",posy:"{posy}", species:"{species}",weigth:"{weight}",length:"{length}",imageurl:"{imageurl}",other:"{other}",text:"{text}"},
                  desc:"Url to create a new catch"
              },
              getspecific:{href:"/api/catch/:name", method:"GET", params:"{name}", desc:"Url to get specific catch"},
              getall:{href:"/api/catch/listCatches", method:"GET", desc:"Url to get all catches"},
              putspecific:{href:"/api/catch/:name", method:"PUT", params:"{name}",headers:{contenttype:"application/x-www-form-urlencoded",xaccesstoken:"{token}"},
               body:{name:"{name}",user:"{user}",posx:"{posx}",posy:"{posy}", species:"{species}",weigth:"{weight}",length:"{length}",imageurl:"{imageurl}",other:"{other}",text:"{text}"},
               desc:"Url to do a put on a specific catch, is optional so doesn't matter if 1 field or all fields is being updated"},
              deletespecific:{href:"/api/catch/:name", method:"DELETE", params:"{name}", desc:"Url to delete a specific catch"}
          }
        });

});

router.route("/webhook")
    .get(function(req, res) {
        res.json({size:"3",
                  links:{
                    self:{href:"/api/webhook", method:"GET", desc:"Url to resources for webhook, also is the current url"},
                    add:{href:"/api/webhook", method:"POST", headers:{contenttype:"application/x-www-form-urlencoded",xaccesstoken:"{token}"},
                      body:{url:"{url}"}, desc:"Url to add a new webhook with a POST"},
                    getall:{href:"/api/webhook/listWebhooks", method:"GET", desc:"Url to get all webhooks"}
                  }
        });
});

router.route("/user")
    .get(function(req, res) {

      res.json({
      size:"3",
      links:{
          self:{href:"/api/user", method:"GET", desc:"Url to resources for user, also is the current url"},
          register:{href:"/api/user", method:"POST", headers:{contenttype:"application/x-www-form-urlencoded",xaccesstoken:"{token}"},
            body:{user:"{user}", pass:"{pass}"}, desc:"Url to register a new user with a POST"},
          getAll:{href:"/api/user/listUsers", method:"GET", desc:"Url to get all users"}
      }


      });


    });



router.route("/catch/listCatches")
    .get(function(req, res) {
      catchSchema.find({}, function(err, result)
      {
        if(err)
        {
            res.status(500).json({message:"Something went wrong when trying to list catches"});
        }
        res.end(JSON.stringify(result));
      });
    });

    router.route("/user/listUsers")
        .get(function(req, res) {
          User.find({}, function(err, result)
          {
            let contxt = {
              users: result.map(function(user) {
                return {
                  username: user.username,
                };
              }),
            };


            if(err)
            {
              res.status(500).json({message:"Something went wrong when tried to get the user"});
            }
            res.end(JSON.stringify(contxt.users));
          });
    });

router.route("/catch/:name")
    .get(function(req, res)
    {
      catchSchema.findOne({ name: req.params.name }, function(err, _catch)
      {
          if (err)
            res.status(500).json({message:"Something went wrong when trying to find a catch"});
          if(_catch === null)
          {
            res.status(404).json({message: "Resource not found"});
          }
          res.end( JSON.stringify(_catch) );
      });
});

//routes for register new user.
router.route("/user")
    .post(function(req, res) {
      let usrname = xss(req.body.user);
      let passwrd = xss(req.body.pass);
      if(usrname.length < 1 || passwrd.length < 1)
      {
         res.status(400).json({message:"No input on username or password."});
      }
      else if( passwrd.length < 6)
      {
        res.status(400).json({message:"Password must be atleast 6 characters long."});
      }
      else if(usrname.length > 31 || passwrd.length > 31)
      {
          res.status(400).json( {message:"Username and or password can't be longer than 30 characters."});
      }
      else
      { //valid input and user doesn't exists, then create user.
        let user = new User({
          username: usrname,
          password: passwrd,
      });
      //saving user in db with mongoose command .save and send flash mess-
      user.save().then(function() {
          res.status(201).json({ message: 'User created!' });
      }).catch(function(error) {
        console.log(error.message);
        res.status(500).json({message:"Something went wrong when tried to register user"});
      });
    }
});

router.route("/webhook/listWebhooks")
  .get(function(req,res)
  {

    var contents = fs.readFileSync("./webHooksDB.json");
    // Define to JSON type
     var jsonContent = JSON.parse(contents);
     res.json(jsonContent);
  });

router.route("/auth")
        .post(function(req, res) {

          User.findOne({
             username: req.body.user
           }, function(err, user) {

             if (err)
              res.status(500).json({message:"Something went wrong when trying to find a user"});

             if (!user) {
               res.status(401).json({message: 'Authentication failed. Wrong Username or password.' });
             } else if (user) {


                 user.comparePassword(req.body.pass, function(err, isMatch) {
                     if (err)
                     {
                        res.status(500).json({message:"Something went wrong when validating"});
                     }
                     else
                     { //check if no match with password output error message
                       if(!isMatch)
                       {
                         res.status(401).json({message: 'Authentication failed. Wrong Username or password.' });
                       }
                       else
                       { //successful login. set token
                         var token = jwt.sign(user, db.secret, {
                           expiresIn: '10m' // expires in 10 minutes
                         });

                         // return the information including token as JSON
                         res.json({
                           message: "Enjoy your token",
                           token: token
                         });
                       }
                    }
                 });

             }

           });
    });



router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, db.secret, function(err, decoded) {
      if (err) {
        return res.status(401).json({message:"Failed to authenticate token" });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token return 403 forbidden error
    return res.status(403).json({message: "No token provided"});

  }
});


router.route("/catch/:name")
      .put(function(req,res)
      {
        catchSchema.findOne({name: req.params.name}, function(err, _catch) {

            if (err)
              return res.status(500).json({message:"Something went wrong when trying to find a catch"});
            if(_catch === null)
            {
              return res.status(404).json({message: "Couldn't find the given catch name"});
            }

            if(req.body.name !== undefined)
            {
              if(req.body.name.length > 40)
              {
                return res.status(400).json({message:"The name of the catch is too long, make it max 40 characters"});
              }
              _catch.name = xss(req.body.name);
            }
            if(req.body.user !== undefined)
            {
              if(req.body.user.length > 40)
              {
                return res.status(400).json({message:"The username is too long, make it max 40 characters"});
              }
              _catch.user = xss(req.body.user);
            }
            if(req.body.posx !== undefined)
            {

              var posx = parseFloat(req.body.posx);

              if (!isNaN(posx) && posx <= 90 && posx >= -90)
              {
                  _catch.posX = xss(req.body.posx);
              }
              else
              {
                return res.status(400).json({message:"posx is not a coordinate, try again"});
              }
            }
            if(req.body.posy !== undefined)
            {
              var posy = parseFloat(req.body.posy);
              if (!isNaN(posy) && posy <= 90 && posy >= -90)
              {
                _catch.posY = xss(req.body.posy);
              }
              else {
                return res.status(400).json({message:"posx is not a coordinate, try again"});
              }
            }
            if(req.body.species !== undefined)
            {
              if(req.body.species.length > 40)
              {
                return res.status(400).json({message:"The species name is too long, make it max 40 characters"});
              }
              _catch.species = xss(req.body.species);
            }
            if(req.body.weight !== undefined)
            {
              if(isNaN(req.body.weight))
              {
                return res.status(400).json({message:"Input for weight is not a number, try again."});
              }
              _catch.weight = xss(req.body.weight);
            }
            if(req.body._length !== undefined)
            {
              if(isNaN(req.body._length))
              {
                return res.status(400).json({message:"Input for length is not a number, try again."});
              }
              _catch.length = xss(req.body._length);
            }
            if(req.body.imageurl !== undefined)
            {
              if(req.body.imageurl.match(/\.(jpeg|jpg|gif|png)$/) !== null)
              {
                  _catch.imageURL = xss(req.body.imageurl);
              }
              else {
                return res.status(400).json({message:"The imageurl is not valid, try again"});
              }

            }
            //change date time
            _catch.timestamp = Date.now();

            if(req.body.other !== undefined)
            {
              if(req.body.other.length > 120)
              {
                return res.status(400).json({message:"Other field input is too long, make it max 120 characters"});
              }
              _catch.other =  xss(req.body.other);
            }
            if(req.body.text !== undefined)
            {
              if(req.body.text.length > 120)
              {
                return res.status(400).json({message:"Text input is too long, make it max 120 characters"});
              }
              _catch.text = xss(req.body.text);
            }

            _catch.save(function(err) {
                if (err)
                    res.status(500).json({message:"Something went wrong when tried saving to database"});

                res.json({ message: 'catch updated!' });
            });

        });
      }).delete(function(req, res) {

          catchSchema.findOne({name: req.params.name}, function(err, _catch) {

            if(_catch === null)
            {
                return res.status(404).json({message:"Could not find the catch"});
            }

            var promise = catchSchema.findOneAndRemove({name: req.params.name}).exec();

            promise.then(function()
            {
              res.json({ message: "catch successfully deleted" });

            }).catch(function()
            {
                res.status(500).json({message: "Something went wrong when trying to delete"});
            });
          });
        });

router.route("/catch")
    .post(function(req, res)
    {
        if(req.body.name === undefined || req.body.name.length > 40 || req.body.name.length < 1 )
        {
          return res.status(400).json({message:"The name of the catch must be between 1 to 40 characters"});
        }

        if(req.body.user === undefined || req.body.user.length > 40 || req.body.user.length < 1)
        {
          return res.status(400).json({message:"The username must be between 1 to 40 characters"});
        }

        var lngExp = /^(?=.)-?((0?[8-9][0-9])|180|([0-1]?[0-7]?[0-9]))?(?:\.[0-9]{1,20})?$/;
        var regexX = new RegExp(lngExp);

        if (req.body.posx === undefined || !req.body.posx.match(regexX))
        {
          return res.status(400).json({message:"posx is not a coordinate or has no input, try again"});
        }

        var latExp = /^(?=.)-?((8[0-5]?)|([0-7]?[0-9]))?(?:\.[0-9]{1,20})?$/;
        var regexY = new RegExp(latExp);
        if(req.body.posy === undefined || !req.body.posy.match(regexY))
        {
          return res.status(400).json({message:"posy is not a coordinate or has no input, try again"});
        }

        if(req.body.species === undefined || req.body.species.length > 40 || req.body.species.length < 1)
        {
          return res.status(400).json({message:"The species name must be between 1 to 40 characters"});
        }

        if(isNaN(req.body.weight) || req.body.weight === undefined)
        {
          return res.status(400).json({message:"Input for weight is not a number or has no input, try again."});
        }

        if(isNaN(req.body.length) || req.body.length === undefined)
        {
          return res.status(400).json({message:"Input for length is not a number or has no input, try again."});
        }

        if(req.body.imageurl === undefined || req.body.imageurl.match(/\.(jpeg|jpg|gif|png)$/) === null)
        {
            return res.status(400).json({message:"The imageurl is not valid or has no input, try again"});
        }

        if(req.body.other === undefined || req.body.other.length > 120 || req.body.other.length < 1)
        {
          return res.status(400).json({message:"Other field input must be between 1 and 120 characters"});
        }

        if(req.body.text === undefined || req.body.text.length > 120 || req.body.text.length < 1)
        {
          return res.status(400).json({message:"Text input must be between 1 and 120 characters"});
        }

      var _catch = new catchSchema({
        name: xss(req.body.name),
        user:  xss(req.body.user),
        posX:  xss(req.body.posx),
        posY:  xss(req.body.posy),
        species:  xss(req.body.species),
        weight:  xss(req.body.weight),
        length:  xss(req.body.length),
        imageURL:  xss(req.body.imageurl),
        other:  xss(req.body.other),
        text:  xss(req.body.text),
        url:"https://localhost:3000/api/catch/"+xss(req.body.name)

      });
      _catch.save().then(function()
      {
        res.status(201).json({message: "catch created successfully"});
        webHooks.trigger('catchWebhook1', _catch);

      }).catch(function(error) {
          console.log(error.message);
          res.status(500).json({message:"Something went wrong when tried to create a new catch"});

      });

});


router.route("/webhook")
  .post(function(req,res)
  {

    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if(!req.body.url.match(regex))
    {
      return res.status(400).json({message:"Not a valid webhook adress."});
    }
    webHooks.add('catchWebhook1', req.body.url).then(function(){

        res.status(201).json({ message: 'added webhook' });
    }).catch(function(err){
        console.log(err);
        res.status(500).json({message: "Something went wrong when tried to add webhook."});
    });
  });


module.exports = router;
