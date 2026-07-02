'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const { createLogger, format, transports } = winston;

const LOG_DIR = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(LOG_DIR)) {
	fs.mkdirSync(LOG_DIR, { recursive: true });
}

const timeIST = () => new Date().toLocaleString('en-IN', {
	timeZone: 'Asia/Kolkata',
	hour12: false
});

const getLabel = (callingModule) => {
	if (!callingModule || !callingModule.filename) {
		return 'app';
	}

	return path.relative(path.join(__dirname, '..'), callingModule.filename);
};

const serialize = (value) => {
	if (value instanceof Error) {
		return value.stack || value.message;
	}

	if (typeof value === 'string') {
		return value;
	}

	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value);
	}

	if (!value) {
		return '';
	}

	try {
		return JSON.stringify(value);
	} catch (err) {
		return '[Unserializable log data]';
	}
};

const printFormat = format.printf((info) => {
	const label = info.label || 'app';
	const message = serialize(info.message);
	const stack = info.stack ? `\n${info.stack}` : '';

	return `${info.timestamp} - ${info.level}: [${label}] ${message}${stack}`;
});

const logger = createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: format.combine(
		format.errors({ stack: true }),
		format.timestamp({ format: timeIST }),
		printFormat
	),
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.timestamp({ format: timeIST }),
				printFormat
			),
			stderrLevels: ['error']
		}),
		new DailyRotateFile({
			filename: path.join(LOG_DIR, 'application-%DATE%.log'),
			datePattern: 'YYYY-MM-DD',
			maxSize: '20m',
			maxFiles: '14d'
		})
	],
	exceptionHandlers: [
		new DailyRotateFile({
			filename: path.join(LOG_DIR, 'exceptions-%DATE%.log'),
			datePattern: 'YYYY-MM-DD',
			maxSize: '20m',
			maxFiles: '14d'
		})
	],
	rejectionHandlers: [
		new DailyRotateFile({
			filename: path.join(LOG_DIR, 'rejections-%DATE%.log'),
			datePattern: 'YYYY-MM-DD',
			maxSize: '20m',
			maxFiles: '14d'
		})
	],
	exitOnError: false
});

class Logger {
	constructor(callingModule) {
		this.label = getLabel(callingModule);
	}

	info(message) {
		logger.info(message, { label: this.label });
	}

	warn(message) {
		logger.warn(message, { label: this.label });
	}

	error(message) {
		logger.error(message, { label: this.label });
	}

	debug(message) {
		logger.debug(message, { label: this.label });
	}
}

module.exports = Logger;
