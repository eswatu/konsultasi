import pino from 'pino';

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            colorizeObject: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l'
        }
    }
});
export default logger;