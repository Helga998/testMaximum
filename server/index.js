const express = require('express')
const getAllData = require('./db/mongodb')
const app = express()
const port = 777

app.get('/api', async (req, res) => {
  try {
    res.json(await getAllData())
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
  
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
