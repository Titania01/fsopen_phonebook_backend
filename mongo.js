const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Bigmus:${password}@cluster0.d4hlj.mongodb.net/phonebookTest?retryWrites=true&w=majority`

mongoose.connect(url)

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

const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//   name: 'Badmus Adegbite',
//   number: 090867234123,
//   date: new Date(),
//   important: true,
// })

if (process.argv.length === 3) {
        Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        process.exit(1)
    })
}

if (process.argv.length > 3) {
    const name = process.argv[3]
    const number = process.argv[4]
    const newPerson = { name, number}
    new Person(newPerson).save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
        process.exit(1)
    }) 
}

// person.save().then(result => {
//   console.log('person created!')
//   mongoose.connection.close()
// })