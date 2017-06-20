/*jshint esversion:6*/
//setting up schema to communicate with mongodb through mongoose. this item schema which is infact snippets in view.
let mongoose = require("mongoose");

let catchSchema = mongoose.Schema({
  name: {type:String, required: true, unique:true},
  user: { type: String, required: true },
  posX: { type: Number, required: true },
  posY: {type: Number, required: true},
  species: { type: String, required: true },
  weight: { type: Number, required: true },
  length: { type: Number, required: true },
  imageURL: { type: String, required: true },
  timestamp: {type: Date, required: true, default: Date.now},
  other: { type: String },
  text: { type: String, required: true },
  url:{type:String, required:true}
});


let Catch = mongoose.model("catchSchema", catchSchema);
module.exports = Catch;
