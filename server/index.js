const express = require('express')
const getAllData = require('./db/mongodb')
const app = express()
const port = 777

app.get('/', async (req, res) => {
  console.log(await getAllData())
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
