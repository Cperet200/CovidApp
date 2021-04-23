

exports.home = ((req,res)=> 
{
    res.render('home')
})

exports.about = ((req,res)=> 
{
    res.send('This is the About us page')
})

exports.contact = ((req,res)=> 
{
    res.send('This is the contact us page')
})

exports.help = ((req,res)=> 
{
    res.send('This is the help page')
})