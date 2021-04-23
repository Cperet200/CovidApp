const router = require('express').Router()

router.get('/',(req,res) =>{
    res.render('contact',{title:'contact-us'})
})

module.exports=router