import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors';
import { createProxyMiddleware } from "http-proxy-middleware"
import path from 'path'
import {fileURLToPath} from 'url';
dotenv.config();
/*
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
*/
connectDB();

const app = express();

app.use(cors())
app.use(express.json())
app.use(morgan('dev'));
//app.use(express.static(path.join(__dirname, './client/build')))


//routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.get('/', (req,res) => {
    res.send("<h1>СЕРВЕР ЗАПУЩЕН</h1>")
})


/*
app.use('*',function (req,res){
    res.sendFile(path.join(__dirname, './client/dist/index.html'));
})
*/
const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=> {
    console.log(`Запуск сервера ${process.env.DEV_MODE} по порту ${PORT}`.bgCyan.red);
})