import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import enquiryRoutes from './routes/enquiryRoutes.js'


const app = express();

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


app.get('/', (req, res) => {
  res.json({ message: 'Gigfactory backend is running' });
});

app.use('/api', apiRoutes);
app.use('/api', enquiryRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;

