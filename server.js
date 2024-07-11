import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectdb from './config/db.js';
import authRoute from './routes/authRoute.js';
import bodyParser from 'express';
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import addressRoute from './routes/addressRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure environment variables
dotenv.config();

// Connect to the database
connectdb();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// User router
app.use('/api/user', authRoute);

// Category router
app.use('/api/category', categoryRoutes);

// Product router
app.use('/api/product', productRoute);

// Cart router
app.use('/api/cart', cartRoute);

// Address router
app.use('/api/address', addressRoute);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// REST API
app.get('/', function (req, res) {
  res.send('Hello World');
});

// Serve the React app for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
