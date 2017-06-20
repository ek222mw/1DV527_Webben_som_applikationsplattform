var msgpack = require('msgpack5')(),
encode = msgpack.encode,
json2html = require('node-json2html');
//influenced from book chapter 7.
module.exports = (value) => { 
  return{
    call:function(req, res) {

      console.info('Representation converter middleware called!');

      if (value) {
        if (req.accepts('json')) {
          console.info('JSON representation selected!');
          return res.send(value);
        }

        if (req.accepts('html')) {
          console.info('HTML representation selected!');
          var transform = {'tag': 'div', 'html': '${name} : ${value}'};
          return res.send(json2html.transform(req.result, transform));
        }

        if (req.accepts('application/x-msgpack')) {
          console.info('MessagePack representation selected!');
          res.type('application/x-msgpack');
          return res.send(encode(req.result));
        }

        console.info('Defaulting to JSON representation!');
        return res.send(req.result);
      }
    }
  };
};
