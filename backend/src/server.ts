import { Server } from 'http';
import app from './app';
import { seedAdmin } from './app/utils/seedAdmin';
import { envVars } from './app/config/env';
import prisma from './app/utils/prisma';

let server: Server;

// Graceful shutdown: one function, reused by every event
const exitHandler = (exitCode: number) => {
    console.log('Shutting down server...');

    // Safety net: if shutdown hangs for 10 seconds, force exit
    const forceExit = setTimeout(() => {
        console.error('Forced shutdown (timeout).');
        process.exit(exitCode);
    }, 10000);
    forceExit.unref(); // don't let this timer keep the process alive

    if (server) {
        // 1. stop accepting new requests, let current ones finish
        server.close(async () => {
            try {
                // 2. close the database connection
                await prisma.$disconnect();
                console.log('Server and database closed gracefully.');
            } catch (err) {
                console.error('Error while disconnecting database:', err);
            } finally {
                // 3. exit
                process.exit(exitCode);
            }
        });
    } else {
        process.exit(exitCode);
    }
};

async function startServer() {
    try {
        server = app.listen(envVars.PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1);
    }
}

// ----- Connect the handler to events -----

// Normal shutdown (exit code 0)
process.on('SIGTERM', () => {
    console.log('SIGTERM received.... Server is shutting down gracefully.');
    exitHandler(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received (Ctrl + C)... Server is shutting down gracefully.');
    exitHandler(0);
});

// Error shutdown (exit code 1)
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection detected:', error);
    exitHandler(1);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception detected:', error);
    exitHandler(1);
});

(async () => {
    await startServer();
    await seedAdmin();
})();
