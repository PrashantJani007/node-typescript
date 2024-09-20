import express, { urlencoded } from 'express';
import  connection  from "./db/config";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import profileRoutes from "./routes/profileRoutes";
import jokeRoutes from "./routes/jokeRoutes";
import authUser from './middlewares/auth';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(urlencoded({extended:true}));

app.use('/api/users',userRoutes);
app.use('/api/users',authUser,profileRoutes);
app.use('/api/',authUser,jokeRoutes);

connection.sync().then(()=>{
    console.log("database synced successfully.");
}).catch((err)=>{
    console.log(err);
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});