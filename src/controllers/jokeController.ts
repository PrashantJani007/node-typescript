import { RequestHandler } from "express";
import axios from "axios";

export const getRandomJoke: RequestHandler = async (req, res) => {
    try {
        const response = await axios.get("https://api.chucknorris.io/jokes/random");
        const joke = response.data;
        return res.status(200).json({ status: true, joke: joke.value });
    } catch (error: any) {
        return res.status(500).json({ status: false, message: "Failed to fetch joke", error: error.message });
    }
};
