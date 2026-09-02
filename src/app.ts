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
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :root {
                --navy: #102a4c;
                --navy-dark: #071a31;
                --blue: #0866d8;
                --blue-light: #edf6ff;
                --orange: #ff8a00;
                --green: #58b816;
                --muted: #66788f;
                --border: #e2eaf3;
                --white: #ffffff;
            }

            body {
                min-height: 100vh;

                font-family:
                    Inter,
                    ui-sans-serif,
                    system-ui,
                    -apple-system,
                    BlinkMacSystemFont,
                    "Segoe UI",
                    sans-serif;

                color: var(--navy);
                background: #ffffff;

                -webkit-font-smoothing: antialiased;
                text-rendering: optimizeLegibility;
            }

            .gridcare-page {
                width: 100%;
                min-height: 100vh;
                overflow: hidden;
                background: #ffffff;
            }

            /* =====================================================
               HERO
            ===================================================== */

            .hero {
                position: relative;
                min-height: 570px;

                display: flex;
                align-items: center;

                background:
                    linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0.98) 0%,
                        rgba(255, 255, 255, 0.94) 32%,
                        rgba(255, 255, 255, 0.55) 55%,
                        rgba(255, 255, 255, 0.10) 80%,
                        rgba(255, 255, 255, 0) 100%
                    ),
                    url("/Banner.png")
                    center / cover no-repeat;

                border-bottom: 5px solid var(--orange);
            }

            .hero::after {
                content: "";

                position: absolute;
                left: 50%;
                bottom: -11px;

                width: 340px;
                height: 16px;

                transform: translateX(-50%);

                background: var(--orange);

                border-radius: 0 0 12px 12px;
            }

            .hero-content {
                position: relative;
                z-index: 2;

                width: min(
                    1400px,
                    calc(100% - 48px)
                );

                margin: 0 auto;

                padding: 65px 0;
            }

            /* =====================================================
               BRAND
            ===================================================== */

            .brand {
                margin-bottom: 22px;

                font-size: clamp(
                    58px,
                    7vw,
                    94px
                );

                font-weight: 900;

                letter-spacing: -5px;

                line-height: 0.95;
            }

            .brand-grid {
                color: var(--navy-dark);
            }

            .brand-care {
                color: var(--orange);
            }

            /* =====================================================
               TAGLINE
            ===================================================== */

            .tagline {
                display: flex;
                align-items: center;

                gap: 14px;

                margin-bottom: 40px;

                color: var(--navy);

                font-size: clamp(
                    14px,
                    1.5vw,
                    20px
                );

                font-weight: 700;

                letter-spacing: 1.4px;

                text-transform: uppercase;
            }

            .tagline::before,
            .tagline::after {
                content: "";

                width: 42px;
                height: 3px;

                background: var(--orange);

                border-radius: 10px;
            }

            /* =====================================================
               HERO FEATURES
            ===================================================== */

            .hero-features {
                display: grid;

                grid-template-columns:
                    repeat(4, 1fr);

                width: min(
                    760px,
                    100%
                );
            }

            .hero-feature {
                min-height: 125px;

                display: flex;
                flex-direction: column;

                align-items: center;
                justify-content: center;

                padding: 12px 18px;

                text-align: center;

                border-right:
                    1px solid
                    rgba(
                        16,
                        42,
                        76,
                        0.16
                    );

                transition:
                    transform 0.25s ease,
                    background 0.25s ease;
            }

            .hero-feature:last-child {
                border-right: none;
            }

            .hero-feature:hover {
                transform: translateY(-5px);

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.30
                    );
            }

            .feature-icon {
                width: 64px;
                height: 64px;

                display: flex;
                align-items: center;
                justify-content: center;

                margin-bottom: 13px;

                color: var(--blue);

                background:
                    rgba(
                        237,
                        246,
                        255,
                        0.94
                    );

                border-radius: 50%;

                font-size: 30px;

                box-shadow:
                    0 8px 25px
                    rgba(
                        8,
                        102,
                        216,
                        0.10
                    );
            }

            .hero-feature h3 {
                color: var(--navy);

                font-size: 14px;

                font-weight: 700;

                line-height: 1.45;
            }

            /* =====================================================
               WELCOME
            ===================================================== */

            .welcome {
                position: relative;

                padding: 90px 0 105px;

                background:
                    radial-gradient(
                        circle at 5% 80%,
                        rgba(
                            8,
                            102,
                            216,
                            0.045
                        ),
                        transparent 28%
                    ),
                    radial-gradient(
                        circle at 90% 20%,
                        rgba(
                            255,
                            138,
                            0.045
                        ),
                        transparent 25%
                    ),
                    #ffffff;
            }

            .welcome-container {
                position: relative;
                z-index: 2;

                width: min(
                    1400px,
                    calc(100% - 48px)
                );

                margin: 0 auto;

                display: grid;

                grid-template-columns:
                    1.05fr
                    1.3fr;

                gap: 70px;

                align-items: center;
            }

            /* =====================================================
               WELCOME LEFT
            ===================================================== */

            .welcome-left {
                padding-right: 20px;
            }

            .welcome-badge {
                display: inline-flex;

                align-items: center;

                gap: 12px;

                margin-bottom: 27px;

                padding:
                    10px
                    20px
                    10px
                    12px;

                color: #ffffff;

                background: var(--orange);

                border-radius: 999px;

                font-size: 14px;

                font-weight: 800;

                letter-spacing: 0.5px;

                text-transform: uppercase;

                box-shadow:
                    0 8px 25px
                    rgba(
                        255,
                        138,
                        0,
                        0.20
                    );
            }

            .badge-icon {
                width: 36px;
                height: 36px;

                display: flex;
                align-items: center;
                justify-content: center;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

                border-radius: 50%;

                font-size: 18px;
            }

            .welcome-title {
                margin-bottom: 26px;

                color: var(--navy);

                font-size: clamp(
                    36px,
                    4vw,
                    57px
                );

                font-weight: 800;

                letter-spacing: -2.5px;

                line-height: 1.1;
            }

            .welcome-title .accent {
                color: var(--orange);
            }

            .welcome-divider {
                width: 100%;
                height: 1px;

                margin-bottom: 25px;

                background: var(--border);
            }

            /* =====================================================
               MESSAGE
            ===================================================== */

            .welcome-message {
                display: flex;

                align-items: center;

                gap: 22px;
            }

            .message-icon {
                flex: 0 0 auto;

                width: 74px;
                height: 74px;

                display: flex;

                align-items: center;
                justify-content: center;

                color: var(--blue);

                background:
                    var(--blue-light);

                border-radius: 50%;

                font-size: 30px;
            }

            .welcome-message p {
                color: var(--navy);

                font-size: 18px;

                line-height: 1.8;
            }

            .welcome-message strong {
                color: var(--orange);
            }

            /* =====================================================
               VALUES
            ===================================================== */

            .values {
                display: grid;

                grid-template-columns:
                    repeat(4, 1fr);

                gap: 0;
            }

            .value {
                min-height: 235px;

                padding: 0 24px;

                text-align: center;

                border-right:
                    1px solid
                    var(--border);

                transition:
                    transform 0.25s ease;
            }

            .value:last-child {
                border-right: none;
            }

            .value:hover {
                transform: translateY(-5px);
            }

            .value-icon {
                width: 82px;
                height: 82px;

                display: flex;

                align-items: center;
                justify-content: center;

                margin:
                    0
                    auto
                    22px;

                color: var(--blue);

                background:
                    var(--blue-light);

                border-radius: 50%;

                font-size: 34px;
            }

            .value:nth-child(4)
                .value-icon {
                color: var(--green);

                background:
                    #effbe7;
            }

            .value h3 {
                margin-bottom: 13px;

                color: var(--navy);

                font-size: 15px;

                font-weight: 800;
            }

            .value p {
                color: #4d5f75;

                font-size: 13px;

                line-height: 1.8;
            }

            /* =====================================================
               FOOTER
            ===================================================== */

            .footer {
                padding: 22px 24px;

                color: #8492a5;

                background: #f8fafc;

                border-top:
                    1px solid
                    var(--border);

                text-align: center;

                font-size: 13px;
            }

            .footer strong {
                color: var(--navy);
            }

            .footer .orange {
                color: var(--orange);
            }

            /* =====================================================
               TABLET
            ===================================================== */

            @media (max-width: 1050px) {

                .hero {
                    min-height: 530px;

                    background:
                        linear-gradient(
                            90deg,
                            rgba(
                                255,
                                255,
                                255,
                                0.97
                            ) 0%,
                            rgba(
                                255,
                                255,
                                255,
                                0.85
                            ) 50%,
                            rgba(
                                255,
                                255,
                                255,
                                0.25
                            ) 100%
                        ),
                        url("/Banner.png")
                        center / cover no-repeat;
                }

                .welcome-container {
                    grid-template-columns: 1fr;

                    gap: 65px;
                }

                .welcome-left {
                    padding-right: 0;

                    text-align: center;
                }

                .welcome-message {
                    justify-content: center;

                    text-align: left;
                }

                .values {
                    max-width: 900px;

                    margin: 0 auto;
                }
            }

            /* =====================================================
               MOBILE
            ===================================================== */

            @media (max-width: 700px) {

                .hero {
                    min-height: auto;

                    background:
                        linear-gradient(
                            180deg,
                            rgba(
                                255,
                                255,
                                255,
                                0.96
                            ) 0%,
                            rgba(
                                255,
                                255,
                                255,
                                0.90
                            ) 58%,
                            rgba(
                                255,
                                255,
                                255,
                                0.72
                            ) 100%
                        ),
                        url("/Banner.png")
                        center / cover no-repeat;
                }

                .hero-content {
                    width:
                        calc(100% - 32px);

                    padding:
                        65px
                        0
                        60px;
                }

                .brand {
                    font-size:
                        clamp(
                            54px,
                            16vw,
                            78px
                        );

                    letter-spacing: -4px;

                    text-align: center;
                }

                .tagline {
                    justify-content: center;

                    margin-bottom: 34px;

                    font-size: 11px;

                    letter-spacing: 0.7px;

                    text-align: center;
                }

                .tagline::before,
                .tagline::after {
                    width: 25px;
                }

                .hero-features {
                    grid-template-columns:
                        repeat(2, 1fr);

                    width: 100%;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            0.60
                        );

                    border-radius: 20px;

                    backdrop-filter:
                        blur(6px);
                }

                .hero-feature {
                    min-height: 125px;

                    padding:
                        15px
                        10px;

                    border-right:
                        1px solid
                        rgba(
                            16,
                            42,
                            76,
                            0.12
                        );

                    border-bottom:
                        1px solid
                        rgba(
                            16,
                            42,
                            76,
                            0.12
                        );
                }

                .hero-feature:nth-child(2n) {
                    border-right: none;
                }

                .hero-feature:nth-child(3),
                .hero-feature:nth-child(4) {
                    border-bottom: none;
                }

                .feature-icon {
                    width: 52px;
                    height: 52px;

                    margin-bottom: 9px;

                    font-size: 23px;
                }

                .hero-feature h3 {
                    font-size: 12px;
                }

                .hero::after {
                    width: 190px;
                }

                /* Welcome */

                .welcome {
                    padding:
                        65px
                        0
                        80px;
                }

                .welcome-container {
                    width:
                        calc(100% - 32px);

                    gap: 50px;
                }

                .welcome-badge {
                    font-size: 12px;
                }

                .welcome-title {
                    font-size:
                        clamp(
                            34px,
                            10vw,
                            46px
                        );

                    letter-spacing: -1.8px;
                }

                .welcome-message {
                    align-items:
                        flex-start;
                }

                .message-icon {
                    width: 58px;
                    height: 58px;

                    font-size: 24px;
                }

                .welcome-message p {
                    font-size: 15px;
                }

                /* Values */

                .values {
                    grid-template-columns:
                        repeat(2, 1fr);
                }

                .value {
                    min-height: 220px;

                    padding: 15px;

                    border-right:
                        1px solid
                        var(--border);

                    border-bottom:
                        1px solid
                        var(--border);
                }

                .value:nth-child(2n) {
                    border-right: none;
                }

                .value:nth-child(3),
                .value:nth-child(4) {
                    border-bottom: none;
                }

                .value-icon {
                    width: 68px;
                    height: 68px;

                    margin-bottom: 17px;

                    font-size: 28px;
                }

                .value p {
                    font-size: 12px;
                }
            }

            /* =====================================================
               SMALL MOBILE
            ===================================================== */

            @media (max-width: 420px) {

                .hero-content {
                    padding-top: 52px;
                }

                .values {
                    grid-template-columns: 1fr;
                }

                .value {
                    min-height: auto;

                    padding:
                        25px
                        20px;

                    border-right:
                        none !important;

                    border-bottom:
                        1px solid
                        var(--border) !important;
                }

                .value:last-child {
                    border-bottom:
                        none !important;
                }
            }
        </style>


        <div class="gridcare-page">

            <!-- =================================================
                 HERO
            ================================================== -->

            <section class="hero">

                <div class="hero-content">

                    <div class="brand">
                        <span class="brand-grid">
                            Grid
                        </span><span class="brand-care">
                            Care
                        </span>
                    </div>


                    <div class="tagline">
                        Smart Power Outage Management System
                    </div>


                    <div class="hero-features">

                        <div class="hero-feature">

                            <div class="feature-icon">
                                ⚡
                            </div>

                            <h3>
                                Real-time<br />
                                Monitoring
                            </h3>

                        </div>


                        <div class="hero-feature">

                            <div class="feature-icon">
                                🛡️
                            </div>

                            <h3>
                                Outage<br />
                                Management
                            </h3>

                        </div>


                        <div class="hero-feature">

                            <div class="feature-icon">
                                📊
                            </div>

                            <h3>
                                Analytics &<br />
                                Insights
                            </h3>

                        </div>


                        <div class="hero-feature">

                            <div class="feature-icon">
                                🔔
                            </div>

                            <h3>
                                Instant<br />
                                Alerts
                            </h3>

                        </div>

                    </div>

                </div>

            </section>


            <!-- =================================================
                 WELCOME
            ================================================== -->

            <section class="welcome">

                <div class="welcome-container">

                    <div class="welcome-left">

                        <div class="welcome-badge">

                            <span class="badge-icon">
                                👥
                            </span>

                            Welcome Aboard

                        </div>


                        <h1 class="welcome-title">

                            Welcome to
                            <span class="accent">
                                GridCare
                            </span>,

                            <br />

                            Powering a Smarter Future!

                        </h1>


                        <div class="welcome-divider"></div>


                        <div class="welcome-message">

                            <div class="message-icon">
                                👥
                            </div>

                            <p>

                                We're excited to have you
                                on board.

                                <br />

                                Let's
                                <strong>
                                    power the future
                                </strong>,
                                together.

                            </p>

                        </div>

                    </div>


                    <div class="values">

                        <div class="value">

                            <div class="value-icon">
                                ⚡
                            </div>

                            <h3>
                                Smart Solutions
                            </h3>

                            <p>
                                Real-time monitoring
                                and intelligent outage
                                management.
                            </p>

                        </div>


                        <div class="value">

                            <div class="value-icon">
                                🛡️
                            </div>

                            <h3>
                                Reliable Systems
                            </h3>

                            <p>
                                Built with enterprise-grade
                                security and high reliability.
                            </p>

                        </div>


                        <div class="value">

                            <div class="value-icon">
                                📊
                            </div>

                            <h3>
                                Efficient Operations
                            </h3>

                            <p>
                                Data-driven insights that
                                optimize decisions and reduce
                                downtime.
                            </p>

                        </div>


                        <div class="value">

                            <div class="value-icon">
                                🌿
                            </div>

                            <h3>
                                Sustainable Impact
                            </h3>

                            <p>
                                Supporting a cleaner,
                                smarter and more sustainable
                                future.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            <!-- =================================================
                 FOOTER
            ================================================== -->

            <footer class="footer">

                © ${new Date().getFullYear()}

                <strong>
                    Grid<span class="orange">
                        Care
                    </span>
                </strong>.

                All rights reserved.

            </footer>

        </div>
    `);
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
