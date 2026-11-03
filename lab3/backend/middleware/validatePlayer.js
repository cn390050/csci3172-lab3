export function validatePlayer(req, res, next) {
    const { name, team, position, games, goals, assists } = req.body;

    const validPositions = ["C", "LW", "RW", "D", "G"];

    if (typeof name !== "string" || name.trim() === "" || typeof team !== "string" || team.trim() === "" || !validPositions.includes(position)) {
        const error = new Error("Invalid player position");
        error.status = 400;
        return next(error);
    }

    const stats = [games, goals, assists];

    if (!stats.every(value => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 0)) {
        const error = new Error("Player statistics must be a positive integer");
        error.status = 400;
        return next(error);
    }

    req.body = {
        name: name.trim(),
        team: team.trim().toUpperCase(),
        position,
        games,
        goals,
        assists,
        points: goals + assists
    };

    next();
}