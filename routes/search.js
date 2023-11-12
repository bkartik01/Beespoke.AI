
//new 


// routes/search.js
const express = require('express');
const router = express.Router();
const Catalog = require('../models/catalog');
const User = require('../models/user');
const users = require('../controllers/users');
const { isLoggedIn } = require('../middleware');

router.get('/search',isLoggedIn,(req,res)=>{
  res.send("Use post request");
})

router.post('/search',isLoggedIn, async (req, res) => {
  let { keyword, max_value, min_value } = req.body;
  keyword=keyword.trim();
  
  let query={};
  query.$or = [
    { product_description: { $regex: new RegExp(keyword, 'i')} },
    { brand_name: { $regex: new RegExp(keyword, 'i') } }
  ];
  if(!min_value)
  {
    min_value=Number.MIN_SAFE_INTEGER;
  }
  if(!max_value)
  {
    max_value=Number.MAX_SAFE_INTEGER;
  }
   
  query.price = { $gte: parseFloat(min_value), $lte: parseFloat(max_value) };
  
  
  try {
    const results = await Catalog.find(query)
          .sort({ Rank: -1 })
          .limit(10); 
    res.render('search_output1', { results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// path when user wants to get recommendations

router.get('/recommend',isLoggedIn,async (req,res)=>{

  res.render('recommend');
});

//path when the user enters userid to get recommendations

router.post('/search/recommend',isLoggedIn,async(req,res)=>{
  const {username}=req.body;
  
  let check=[];
  try {
    // Query the database to find the user with the provided username
     check = await User.findOne({ username });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  if (!check) {
       res.status(404).json({ error: 'User not found' });
    }
  else if(!check.preferredcat)
  {
    try {
      //if no preferred catagory show random 10 details
      const results = await Catalog.aggregate([{ $sample: { size: 10 } }]);
  
      res.render('showings',{results});
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  else{
  let query={};
  query.$or = [
    { product_description: { $regex: new RegExp(check.preferredcat, 'i')} },
    { brand_name: { $regex: new RegExp(check.preferredcat, 'i') } }
  ];
   
  try {
    const results = await Catalog.find(query)
          .sort({ Rank: -1 })
          .limit(10); 
    res.render('showings', { results});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  }
});

module.exports = router;
