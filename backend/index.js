const http = require('http')
const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017/'
const client = new MongoClient(url)

const server = http.createServer(async (req, res) => {
  try {
    await client.connect()

    const db = client.db('testdb')
    const collection = db.collection('testcollection')

    const data = await collection.find().toArray()

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Database connection error')
  }
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/')
})