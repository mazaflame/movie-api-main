const express = require('express');
const morgan = require('morgan');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");
const uuid = require("uuid");
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));

let users = [
    {
        "id": "1",
        "name": "Kay",
        "favoriteMovies": []
    },

    {
        "id": "2",
        "name": "Jack",
        "password": "12345",
        "email": "jeez@hotmail.com",
        "birthday": "05-06-2000",
        "favoriteMovies": ["Toy Story"]
    }

];

let movies = [
    {
        "Title":"Django Unchained",
        "Description": " With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi. ",
        "Genre": {
            "Name": "Action",
            "Description": " With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi. ",
        },
        "Director": {
            "Name": "Tarantino",
            "Bio": " brutal movies",
            "Birth":" 1963", 
        },

        "ImgURL":"URL for an image goes here",
        "featured": false //
    },

    {
        "Title": "The Hateful Eight",
        "Description": "A movie about the simpsons but longer",
        "Genre": {
            "Name": "Western",
            "Description": " A movie that makes you laugh.",
        },
        "Director": {
            "Name": "Tarantino",
            "Bio": "brutal movies",
            "Birth":" 1963", 
        },
        "ImgURL":"URL for an image goes here",
        "featured": false //dont know what this means.
    },

    {
        "Title": "Toy Story",
        "Description": "Toy Story is about the 'secret life of toys' when people are not around.",
        "Genre": {
            "Name": "Animation",
            "Description": "Toy Story is about the 'secret life of toys' when people are not around.",
        },
        "Director": {
            "Name": "John Lasseter",
            "Bio": "a cool directior",
            "Birth":" 1957", 
        },

        "ImgURL":"URL for an image goes here",
        "featured": false //dont know what this means.
    },

    {
        "Title": "Scarface",
        "Description": "story of Cuban refugee Tony Montana (Al Pacino), who arrives penniless in Miami during the Mariel boatlift and becomes a powerful and extremely homicidal drug lord.",
        "Genre": {
            "Name": "Action",
            "Description": " story of Cuban refugee Tony Montana (Al Pacino), who arrives penniless in Miami during the Mariel boatlift and becomes a powerful and extremely homicidal drug lord.",
        },
        "Director": {
            "Name": " Brian DePalma",
            "Bio": "a grerat director",
            "Birth":" 1940", 
        },

        "ImgURL":"URL for an image goes here",
        "featured": false //dont know what this means.
    }
];

app.use(express.static('public'));
app.use(morgan("common"));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Welcome to my movie app where you can find movies ");
});

//CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if(newUser.name) {
        newUser.id = uuid.v4()
        users.push(newUser);
        res.status(201).json(newUser);
    } else{
        res.status(400).send('name is required');
    }
})

//UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if(user) {
        user.name = updatedUser.name;
        res.status(201).json(user);
    }else{
        res.status(400).send('user does not exist')
    }
})


//POST
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if(user) {
        user.favoriteMovies.push(movieTitle);
        res.status(201).send(`${movieTitle} has been added to user ${id}'s array`);
    }else{
        res.status(400).send('user does not exist')
    }
})


//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if(user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle )
        res.status(201).send(`${movieTitle} has been removed from user ${id}'s array`);
    }else{
        res.status(400).send('user does not exist')
    }
})

//DELETE
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if(user) {
        users = users.filter( user => user.id != id )
        res.status(201).send(` user ${id} has been deleted `);
    }else{
        res.status(400).send('user does not exist')
    }
})

//READ
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

//READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);
    
    if (movie){
        res.status(200).json(movie);
    } else{
        res.status(400).send('movie not found');
    }
})

//READ
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;
    
    if (genre){
        res.status(200).json(genre);
    } else{
        res.status(400).send('genre not found');
    }
})

//READ
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;
    
    if (director){
       return res.status(200).json(director);
    } else{
        res.status(400).send('director not found');
    } 
})

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});