const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const serverConfig = require('./server/config/serverConfig.json')
const dbConfig = require('./server/config/dbConfig.json')

const routes = require('./server/routes/route-importer')

const app = express()

try {
  mongoose.connect(dbConfig.MongoConStr)

  app.use(express.static(path.join(__dirname, 'client/dist')))
  app.use(bodyParser.urlencoded({ 'extended': 'false' }))
  app.use(bodyParser.json())
  app.use(cors())

  // Initialize backend API rutes
  app.use('/api/', routes)

  // Serve client views
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'))
  })

  const port = serverConfig.dev.PORT || '3000'
  app.listen(port, () => console.log(serverConfig.general.welcome_text))
} catch (error) {
  console.log('Application could not be started!!!')
}
