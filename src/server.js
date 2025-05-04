import dotenv from 'dotenv';
dotenv.config({ path: '/Users/dipanshuthummar/Downloads/Food-Ordering-Website/Food Ordering Website/backend/.env' });
console.log('MONGO_URI:', process.env.MONGO_URI); // Debug output

import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';
import { dbconnect } from './config/database.config.js';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
);

app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

app.get('*', (req, res) => {
  const indexFilePath = path.join(publicFolder, 'index.html');
  if (fs.existsSync(indexFilePath)) {
    res.sendFile(indexFilePath);
  } else {
    res.status(404).send('Index file not found');
  }
});

const PORT = process.env.PORT || 5001
;
(async () => {
  await dbconnect();
  app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
  });
})();