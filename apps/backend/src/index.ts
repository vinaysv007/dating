import express, {Express, Request, Response} from 'express';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnv } from './libs/env';
import { clerkWebHookMiddleware } from './webhook/Clerk';

dotenv.config();

const app: Express = express();
const env = getEnv();

const rawJson = express.raw({type: 'application/json', limit: '1mb'});

app.post('/webhook/clerk', rawJson, async (req: Request, res: Response) => {
    await void clerkWebHookMiddleware(req, res);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(clerkMiddleware());

//Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.send('Server is Running!!');
});

app.get('/api/', (req: Request, res: Response) => {
  res.send('Welcome to the Dating App API v3');
});

app.use((req: Request, res: Response) => {
  res.status(404).json({message: 'Endpoint not found'});
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});