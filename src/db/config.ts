import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";

const connection = new Sequelize({
    dialect:"mysql",
    host:"localhost",
    username:"root",
    password:"",
    database:"unitask",
    models:[User]
});

export default connection;