require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })

function handleGetMovies(req, res){
    const { genre, country, avg_vote} = req.query;
    let results = MOVIES;

    if(genre) { 
        results = results.filter(movies =>
            movies.genre.toLowerCase().includes(genre.toLowerCase())
        )
    }
    if(country) {
        results = results.filter(movies =>
            movies.country.toLowerCase().includes(country.toLowerCase())
        )
    }
    if(avg_vote) {
        results = results.filter(movies =>
            Number(movies.avg_vote) >= Number(avg_vote)
        )
    }
    res.json(results)
}

app.get('/movie', handleGetMovies)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})