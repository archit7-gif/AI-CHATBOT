
const express = require('express')
const app = express()




app.get('/',(req,res)=>{
    res.send("helllo")
})





module.exports = app