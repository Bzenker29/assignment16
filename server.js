const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

let videoGames = [
    {
        _id: 1,
        title: "Call of Duty 4: Modern Warfare",
        genre: "First-Person Shooter",
        mainPlatform: "PlayStation 3, Xbox 360",
        seriesNumber: 4,
        releaseYear: 2007,
        timeframe: "Contemporary",
        maps: ["Crash", "Crossfire", "Backlot", "Pipeline"]
    },
    {
        _id: 2,
        title: "Call of Duty: World at War",
        genre: "First-Person Shooter",
        mainPlatform: "PlayStation 3, Xbox 360",
        seriesNumber: 5,
        releaseYear: 2008,
        timeframe: "World War II",
        maps: ["Castle", "Dome", "Upheaval", "Seelow"]
    },
    {
        _id: 3,
        title: "Call of Duty: Modern Warfare 2",
        genre: "First-Person Shooter",
        mainPlatform: "PlayStation 3, Xbox 360",
        seriesNumber: 6,
        releaseYear: 2009,
        timeframe: "Contemporary",
        maps: ["Terminal", "Rust", "Highrise", "Favela"]
    },
    {
        _id: 4,
        title: "Call of Duty: Black Ops",
        genre: "First-Person Shooter",
        mainPlatform: "PlayStation 3, Xbox 360",
        seriesNumber: 7,
        releaseYear: 2010,
        timeframe: "Cold War",
        maps: ["Nuketown", "Summit", "Firing Range", "Array"]
    },
    {
        _id: 5,
        title: "Call of Duty: Modern Warfare 3",
        genre: "First-Person Shooter",
        mainPlatform: "PlayStation 3, Xbox 360",
        seriesNumber: 8,
        releaseYear: 2011,
        timeframe: "Contemporary",
        maps: ["Dome", "Hardhat", "Seatown", "Arkaden"]
    },
    {
        _id: 6,
        title: "Call of Duty: Black Ops II",
        genre: "First-Person Shooter",
        mainPlatform: "PlayStation 3, Xbox 360",
        seriesNumber: 9,
        releaseYear: 2012,
        timeframe: "Near Future",
        maps: ["Standoff", "Raid", "Hijacked", "Slums"]
    }
];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/games", (req, res) => {
    res.send(videoGames);
});

app.post("/api/games", upload.single("cover"), (req, res) => {
    const result = validateGame(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const newId = videoGames.length > 0 ? videoGames[videoGames.length - 1]._id + 1 : 1;
    const game = {
        _id: newId,
        title: req.body.title,
        genre: req.body.genre,
        mainPlatform: req.body.mainPlatform,
        seriesNumber: req.body.seriesNumber,
        releaseYear: req.body.releaseYear,
        timeframe: req.body.timeframe,
        maps: Array.isArray(req.body.maps) ? req.body.maps : req.body.maps.split(",")
    }

    videoGames.push(game);
    res.send(videoGames);
});

const validateGame = (game) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        title: Joi.string().min(3).required(),
        genre: Joi.string().min(3).required(),
        mainPlatform: Joi.string().min(3).required(),
        seriesNumber: Joi.number().integer().min(1).required(),
        releaseYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
        timeframe: Joi.string().min(3).required(),
        maps: Joi.allow("")
    });

    return schema.validate(game);
};


app.put("/api/games/:id", (req, res) => {
    const gameIndex = videoGames.findIndex(game => game._id == parseInt(req.params.id));
    if (gameIndex > -1) {
        const updatedGame = { ...videoGames[gameIndex], ...req.body };
        videoGames[gameIndex] = updatedGame;
        res.send(videoGames);
    } else {
        res.status(404).send('Game not found');
    }
});

app.delete("/api/games/:id", (req, res) => {
    const gameIndex = videoGames.findIndex(game => game._id == parseInt(req.params.id));
    if (gameIndex > -1) {
        videoGames.splice(gameIndex, 1);
        res.send(videoGames);
    } else {
        res.status(404).send('Game not found');
    }
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});