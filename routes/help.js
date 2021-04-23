const router = require('express').Router()

router.get('/',(req,res) =>{
    res.render('help',{title:'help'})
})

module.exports=router