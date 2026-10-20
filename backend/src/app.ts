import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import helmet from "helmet";
import { envVars } from './app/config/env';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

app.use(helmet());

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

//parser
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Submission Dashboard Server is running...😃",
        environment: envVars.NODE_ENV,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
