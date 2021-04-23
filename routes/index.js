// Create router called router 
const router = require('express').Router();
const axios = require('axios')

// Render Home page of site
router.get('/',(req,res)=>{
    /* rendering view */
    res.render('index',{title:'Home'})
})

/* getting all countries data on home page */
router.get('/countries',(req,res)=>{
    
    /*sending axios get request to fetch data from api */
            axios.get("https://disease.sh/v3/covid-19/countries").then(response=>{
                /*looping through the data for getting country name and iso(eg:UAE, USA) */
                const countries =  response.data.map((country) => ({
                    name: country.country,
                    value: country.countryInfo.iso2,
                  }));
                  return res.send({data:countries})
            }).catch(err=>res.send(err))
       
})

/* getting country data based on user's selection */
router.post('/getCountryData',(req,res)=>{

    let countryCode=req.body.country
    const url = countryCode === "world wide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    axios.get(url).then(response=>{
        /*sending response back to home page */
        return res.send({data:response.data})
    }).catch(err=>res.send(err))
})

/*getting countries data for showing on Table in home page */
router.get('/getCoutriesData',(req,res)=>{
    axios.get("https://disease.sh/v3/covid-19/countries").then(response=>{
        
        return res.send({data:response.data})
    }).catch(err=>res.send(err))
})

/*getting last 4 months data for showing  */
router.get('/historicalData',(req,res)=>{
    axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=120").then(response=>{
        return res.send({data:response.data})
    }).catch(err=>res.send(err))
})

/*exporting the module so that it can be accessible */
module.exports=router

