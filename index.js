// index.js
const express = require('express')
const path = require("path")

const app = express()
const PORT = 4000

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/check',function(req,res){
  res.sendFile(path.join(__dirname,'toShow.html'));
});

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})

// Export the Express API
module.exports = app
