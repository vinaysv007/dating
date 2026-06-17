import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnv } from './libs/env';

dotenv.config();

const app: Express = express();
const env = getEnv();

const rawJson = express.raw({type: 'application/json', limit: '1mb'});

app.use(cors());
app.use(express.json());

//Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.send('Server is Running!!');
});

app.get('/api/', (req: Request, res: Response) => {
  res.send('Welcome to the Dating App API v2');
});

app.use((req: Request, res: Response) => {
  res.status(404).json({message: 'Endpoint not found'});
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});