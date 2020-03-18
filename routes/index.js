var express = require('express');
var router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
let imageSrcs = [];
let alt  =  [];
let movieTitle = "";

/* Load a database of imdb movie links, which will get you gallery images back. */ 
axios.get("https://www.imdb.com/title/tt1431045/?ref_=fn_al_tt_1").then(response => {
  const $ = cheerio.load(response.data); 
  
  /* Find Movie Title */
  const title = $('h1', '.title_wrapper');
  movieTitle = title.text();
  console.log("Movie Text: " + movieTitle);

  const mediastrip = $(".mediastrip", "#titleImageStrip");
  const images = mediastrip.find("a > img");
  
  for (let i = images.length - 1; i > 0; i--){
    imageSrcs.push(images[i].attribs.loadlate); // Ughh imdb hid their image tag... 
    alt.push(images[i].attribs.title);
  } // for 

  // for (image of imageSrcs){
  //   console.log(image);
  // }
  
  
}, err => {
  console.log("Error, Images not loaded!");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {imageSrcs : imageSrcs,
                       movieTitle : movieTitle,
                       alt : alt});
});

router.get('/contact.ejs', function(req, res, next) {
  res.render('contact', null);
});

module.exports = router;
