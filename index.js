// import necessary modules
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

// create instance of Express
const app = express();
const port = 3000;
const weatherArray = ["thunderstrom","drizzle","rain","snow","mist","smoke","haze"," fog","clear","clouds",] ;
// set constant for url and apiKey
const key = "e48922b16801d47c9804d3ad4eebe7dd";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?" ;

// setup Middleware to parse the incoming data and serve static files
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

// define the root route for handling HTTP GET requests
app.get("/",(req,res)=>{
  res.render("index.ejs") ;
}) ;

function weatherIcon(weather){
  for(let i in weatherArray){
    if(weather==weatherArray[i]){
      return `/images/${weather}.png` ;
    }
  }
  return `/images/smoke.png` ;
};

app.post("/post",async(req,res)=>{
  const city = req.body["cityname"] ;
  try{
    const response = await axios.get(API_URL+`q=${city}&appid=${key}&units=metric`) ;
    let str = response.data.weather[0].main ;
    const weather = str.toLowerCase()  ;
    const imgPath = weatherIcon(weather) ;
    const temp = Math.floor(response.data.main.temp) ;
    console.log(weather) ;
    res.render("index.ejs",{data : response.data,temp:temp, imgPath: imgPath}) ;
  }catch(error){
    console.log(error.message) ;
    res.render("index.ejs",{error:"Invalid city Name"}) ;
  }
});

// Start the server and log a message when it's running
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});