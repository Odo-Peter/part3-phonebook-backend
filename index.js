const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));


morgan.token('body', (req, res) =>
  req.method === 'POST' ? JSON.stringify(req.body) : ''
);

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
  {
    id: 5,
    name: 'Martha Poppendieck',
    number: '39-29-6473329',
  },
];

const generateId = () => {
  const randIndex = Math.floor(Math.random() * 100);
  return randIndex;
};

app.post('/api/persons', (req, res) => {
  const body = req.body;
  const personel = persons.map((p) => p.name).includes(body.name);

  if (!body.name || !body.number) {
    res.status(404).json({ error: 'Content missing' });
  } else if (personel) {
    res.status(404).json({ error: 'name must be unique' });
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };
    persons = persons.concat(person);
    res.json(body);

    // console.log(body);
  }
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) return res.json(person);
  else return res.status(400).end();
});

app.get('/api/info', (req, res) => {
  res.send(
    `<h2>Phonebook has info for ${
      persons.length
    } people</h2> <p>${new Date()}</p>`
  );
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

const PORT = 3001;

app.listen(PORT);

console.log(`Server is running on port ${PORT}`);
