import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './app/config';
import router from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { notFound } from './app/middleware/notFound';

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

// Application Routes
app.use('/api/v1', router);

// Basic route
app.get('/', (_req: Request, res: Response) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />

            <meta
                name="description"
                content="GridCare Backend API Server"
            />

            <title>GridCare | Backend Server</title>

            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                html,
                body {
                    min-height: 100%;
                }

                body {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;

                    font-family:
                        Inter,
                        ui-sans-serif,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;

                    background:
                        radial-gradient(
                            circle at 15% 15%,
                            rgba(249, 115, 22, 0.10),
                            transparent 30%
                        ),
                        radial-gradient(
                            circle at 85% 85%,
                            rgba(15, 118, 110, 0.10),
                            transparent 30%
                        ),
                        #f8fafc;

                    color: #0f172a;
                }

                .page {
                    width: 100%;
                    max-width: 850px;
                }

                .card {
                    position: relative;
                    overflow: hidden;

                    padding: 70px 55px;

                    text-align: center;

                    background: rgba(255, 255, 255, 0.96);

                    border: 1px solid #e2e8f0;
                    border-radius: 30px;

                    box-shadow:
                        0 30px 80px rgba(15, 23, 42, 0.08),
                        0 10px 30px rgba(15, 23, 42, 0.04);
                }

                /* Decorative top line */
                .card::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;

                    width: 100%;
                    height: 5px;

                    background: linear-gradient(
                        90deg,
                        #111827,
                        #111827 55%,
                        #f97316
                    );
                }

                /* Logo */
                .logo {
                    margin-bottom: 30px;

                    font-size: clamp(42px, 7vw, 60px);
                    font-weight: 900;
                    letter-spacing: -3px;
                    line-height: 1;
                }

                .grid {
                    color: #111827;
                }

                .care {
                    color: #f97316;
                }

                /* Status */
                .status {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;

                    margin-bottom: 25px;
                    padding: 9px 17px;

                    color: #047857;
                    background: #ecfdf5;

                    border: 1px solid #a7f3d0;
                    border-radius: 999px;

                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.2px;
                }

                .status-dot {
                    width: 9px;
                    height: 9px;

                    background: #10b981;
                    border-radius: 50%;

                    box-shadow:
                        0 0 0 4px rgba(16, 185, 129, 0.12);
                }

                /* Heading */
                h1 {
                    margin-bottom: 18px;

                    color: #0f172a;

                    font-size: clamp(30px, 5vw, 46px);
                    font-weight: 800;
                    letter-spacing: -1.8px;
                    line-height: 1.15;
                }

                /* Description */
                .description {
                    max-width: 600px;

                    margin: 0 auto;

                    color: #64748b;

                    font-size: 17px;
                    line-height: 1.75;
                }

                /* Information */
                .info {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;

                    margin-top: 42px;
                }

                .info-box {
                    padding: 22px 15px;

                    background: #f8fafc;

                    border: 1px solid #e2e8f0;
                    border-radius: 16px;

                    transition:
                        transform 0.2s ease,
                        box-shadow 0.2s ease;
                }

                .info-box:hover {
                    transform: translateY(-3px);

                    box-shadow:
                        0 10px 25px rgba(15, 23, 42, 0.06);
                }

                .info-label {
                    margin-bottom: 8px;

                    color: #94a3b8;

                    font-size: 11px;
                    font-weight: 700;

                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .info-value {
                    color: #0f172a;

                    font-size: 16px;
                    font-weight: 750;
                }

                /* API indicator */
                .api-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;

                    margin-top: 35px;

                    color: #475569;

                    font-size: 13px;
                }

                .api-status span {
                    color: #f97316;
                    font-weight: 700;
                }

                /* Footer */
                footer {
                    margin-top: 28px;

                    color: #94a3b8;

                    font-size: 13px;
                }

                footer strong {
                    color: #64748b;
                }

                /* Responsive */
                @media (max-width: 650px) {
                    body {
                        padding: 16px;
                    }

                    .card {
                        padding: 50px 22px;
                        border-radius: 22px;
                    }

                    .logo {
                        margin-bottom: 25px;
                    }

                    .description {
                        font-size: 15px;
                    }

                    .info {
                        grid-template-columns: 1fr;
                        gap: 12px;
                        margin-top: 32px;
                    }

                    .info-box {
                        padding: 17px;
                    }
                }
            </style>
        </head>

        <body>
            <main class="page">

                <section class="card">

                    <!-- Brand -->
                    <div class="logo">
                        <span class="grid">Grid</span><span class="care">Care</span>
                    </div>

                    <!-- Server Status -->
                    <div class="status">
                        <span class="status-dot"></span>
                        Backend Server Online
                    </div>

                    <!-- Main Heading -->
                    <h1>
                        Welcome to GridCare
                    </h1>

                    <p class="description">
                        The GridCare Backend API server is running successfully
                        and is ready to handle your requests.
                    </p>

                    <!-- Server Information -->
                    <div class="info">

                        <div class="info-box">
                            <div class="info-label">
                                Service
                            </div>

                            <div class="info-value">
                                GridCare API
                            </div>
                        </div>

                        <div class="info-box">
                            <div class="info-label">
                                Version
                            </div>

                            <div class="info-value">
                                API v1
                            </div>
                        </div>

                        <div class="info-box">
                            <div class="info-label">
                                Status
                            </div>

                            <div class="info-value">
                                Operational
                            </div>
                        </div>

                    </div>

                    <!-- API Status -->
                    <div class="api-status">
                        <span>●</span>
                        All systems are operational
                    </div>

                </section>

                <footer>
                    © ${new Date().getFullYear()}
                    <strong>GridCare</strong>.
                    All rights reserved.
                </footer>

            </main>
        </body>
        </html>
    `);
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
