import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './app/config';
import router from './app/routes';

// Express Application Instance
const app: Application = express();

// CORS Middleware
app.use(
    cors({
        origin: config.frontend_url,
        credentials: true,
    }),
);

// Enable URL-encoded form data parsing / parser
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Application routes
app.use('/api/v1', router);

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send(`
        <h2 style="
            color: white;
            background-color: #0f766e;
            font-size: 45px;
            text-align: center;
            padding: 20px;
        ">
            Hello, Welcome to
            <span style="color: #38bdf8;">Grid</span><span style="color: #facc15;">Care</span>
            Backend Server ...!
        </h2>
    `);
});

// Global Error Handler
// app.use(globalErrorHandler);

// Not Found
// app.use(notFound);

export default app;
