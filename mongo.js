const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to...', url);
mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB successfully'))
  .catch((err) => console.log('Error connecting to MongoDB', err.message));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set({
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    res.forEach((person) => {
      console.log(`Phonebook: \n ${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(() => {
    console.log(`added ${person.name} ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
