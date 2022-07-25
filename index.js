const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const url ='mongodb+srv://Bigmus:Bigmus@cluster0.d4hlj.mongodb.net/phonebookTest?retryWrites=true&w=majority'

mongoose.connect(url)

app.use(express.json())

app.use(cors())

app.use(express.static('build'))

morgan.token('data', function(req, res) { 
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - response-time ms :data'))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
    number: {
        type: String,
        required: true
    },
  })

  personSchema.set('toJSON', {
      transform: (document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString()
          delete returnedObject._id
          delete returnedObject.__v
      }
  })

  const Person = mongoose.model('Person', personSchema)


let info = [
    {
        content: "Phonebook has info for 2 people",
        date: new Date().toISOString()
    }
]

app.get('/', (_req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (_req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (_req, res) => {
    res.send(`<h2>Phonebook has info for ${persons.length}</h2> <h2>${info[0].date}</h2>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
persons = persons.filter(person => person.id !== id)
res.json(persons)
    res.status(204).end()
})


app.post('/api/persons', (req, res) => {
    const newId = () => persons.length ? Math.max(...persons.map(person => person.id)) + 1  : 0

    const {name, number} = req.body
    if(!name || !number) {
        return res.status(400).json({error:"name or number is missing"})
    }
    const personExist = persons.some(person => person.name.toLowerCase() === name.toLowerCase())
    if(personExist) {
        return res.status(409).json({error:"name must be unique"})
    }
    const newPerson = {
        id: newId(),
        name,
        number
    }

    persons = persons.concat(newPerson)
    return res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
}) 

