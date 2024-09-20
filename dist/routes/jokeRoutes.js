"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jokeController_1 = require("../controllers/jokeController");
const router = (0, express_1.Router)();
router.get('/random-joke', jokeController_1.getRandomJoke);
exports.default = router;
