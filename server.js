import express from "express"
const app = express()
import dotenv from "dotenv"
import morgan from "morgan"
import connectdb from "./config/db.js"
import authRoute from "./routes/authRoute.js"
import bodyParser from "express"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import addressRoute from "./routes/addressRoute.js"
import categoryRoutes from "./routes/categoryRoute.js"
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//configure env
dotenv.config();

connectdb();

//middleware
app.use(cors());
app.use(bodyParser.json())
app.use(morgan('dev'))

//user router
app.use("/api/user",authRoute);

app.use("/api/category",categoryRoutes);

app.use(express.static(path.join(__dirname,'/client/build')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname,'/client/build/index.html')));

//product router
app.use("/api/product",productRoute);

//cart router
app.use("/api/cart",cartRoute);

//address router
app.use("/api/address",addressRoute);

//rest api
app.get('/', function (req, res) {
  res.send('Hello World')
})

const PORT=process.env.PORT || 8080;
app.listen(PORT)
