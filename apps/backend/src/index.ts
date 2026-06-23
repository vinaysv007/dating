import express, {Express, Request, Response} from 'express';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnv } from './libs/env';
import { clerkWebHookMiddleware } from './webhook/Clerk';
import { db } from './db';
import profileRouter from './profile/profile.routes';
import locationRouter from './location/location.routes';
import preferencesRouter from './preferences/preferences.routes';
import { handleError } from './middleware/handleError';

dotenv.config();

const app: Express = express();
const env = getEnv();

const rawJson = express.raw({type: 'application/json', limit: '1mb'});

app.post('/webhook/clerk', rawJson, async (req: Request, res: Response) => {
  console.log('Received webhook request from Clerk');  
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

app.use('/api/profile', profileRouter);
app.use('/api/location', locationRouter);
app.use('/api/preferences', preferencesRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({message: 'Endpoint not found'});
});

app.use(handleError);

const start = async () => {
  try {
    await db.execute('select 1');
    console.log('Database connection established');
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
}

start();