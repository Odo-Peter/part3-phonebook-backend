require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) =>
  req.method === 'POST' ? JSON.stringify(req.body) : ''
);

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (body.name === undefined || body.number === undefined)
    res.status(404).json({ error: 'Content missing' });
  else {
    const person = new Person({
      name: body.name,
      number: body.number,
    });
    person.save().then((savedPerson) => {
      console.log(savedPerson.id);
      res.json(savedPerson);
    });
  }
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      person ? res.json(person) : res.status(404).end();
    })
    .catch((err) => next(err));
});

app.get('/api/info', (req, res, next) => {
 Person.estimatedDocumentCount()
    .then((count) => {
      res.send(
        `<h2>Phonebook has info for ${
          count
        } people</h2> <p>${new Date()}</p>`
      );
    })
    .catch((err) => next(err));

});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatePerson) => {
      res.json(updatePerson);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => Person.deleteOne(person))
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' });
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
