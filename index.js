const express = require('express'),
    morgan = require('morgan');
const app = express();

let topMovies = [
     {
        title: "TOY STORY",
       director: "John Lasseter",
    },
    {
      title: "No Country for old Man",
      director: "Ethan Coen",
    },
    {
      title: "Hell or Highwater",
      director: "David Mackenzie",
    },
    {
      title: "The Godfather",
      director: "Coppola",
    },
    {
      title: "Moonlight",
      director: "Barry Jenkins",
    },
    {
      title: "The Lord of the Rings: The Two Towers",
      director: "Peter Jackson",
    },
    {
      title: "Hateful Eight",
      director: "Tarantino",
    },
    {
      title: "Schindler's List",
      director: "Steven Spielberg",
    },
    {
      title: "Forrest Gump",
      director: "Robert Zemeckis",
    },
    {
      title: "Scarface",
      director: "Brian De Palma",
    },
];




app.use(express.static('public'));
app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to Movieflix');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get("/documentation", (req, res) => {
    res.sendFile("public/documentation.html", { root: __dirname });
  });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("SOmething went wrong, try again later");
});

app.listen(8080, () => {
    console.log('Your app is listening on Port 8080.');
});