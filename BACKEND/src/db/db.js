

const mongoose = require('mongoose')


const ConncetDB = () =>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("Database Connected")
    }).catch((err)=>{
        console.log("Failed to Connect data base ", err)
    })
}


module.exports = ConncetDB
