import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { validatePlayer } from "../middleware/validatePlayer.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playersFile = path.join(__dirname, "../data/players.json");

let players = JSON.parse(fs.readFileSync(playersFile, "utf-8"));

players = players.map((player, index) => ({
    id: index + 1,
    name: player.name,
    team: player.team,
    position: player.position,
    games: Number(player.games),
    goals: Number(player.goals),
    assists: Number(player.assists),
    points: Number(player.points)
}));

router.get("/", (req, res) => {
    res.json(players);
});


// fetches player data with corresponding ID
router.get("/:id", (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("Invalid player ID");
        error.status = 400;
        return next(error);
    }

    const player = players.find(p => p.id === id);

    if (!player) {
        const error = new Error("Player not found");
        error.status = 404;
        return next(error);
    }

    res.json(player);
});


// adds a Player and their stats to players.json 
router.post("/", validatePlayer, (req, res) => {
    const newPlayer = {
        id: players.length + 1,
        name: req.body.name,
        team: req.body.team,
        position: req.body.position,
        games: req.body.games,
        goals: req.body.goals,
        assists: req.body.assists,
        points: req.body.points
    };

    players.push(newPlayer);

    res.status(201).json(newPlayer);
});

// Deletes player with corresponding ID 
router.delete("/:id", (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("Invalid player ID");
        error.status = 400;
        return next(error);
    }

    const playerIndex = players.findIndex(p => p.id === id);

    if (playerIndex === -1) {
        const error = new Error("Player not found");
        error.status = 404;
        return next(error);
    }

    const deletedPlayer = players.splice(playerIndex, 1)[0];

    res.json({
        message: "Player successfully deleted",
        player: deletedPlayer
    });
});

export default router;