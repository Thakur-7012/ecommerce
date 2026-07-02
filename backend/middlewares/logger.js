'use strict';

const Logger = require('../utils/logger');

const logger = new Logger(module);

const getClientIp = (req) => {
	const forwardedFor = req.headers['x-forwarded-for'];

	if (forwardedFor) {
		return forwardedFor.split(',')[0].trim();
	}

	return req.headers['x-real-ip'] || req.ip || req.socket.remoteAddress || '-';
};

const requestLogger = (req, res, next) => {
	const startTime = Date.now();
	const username = req.headers.username || '-';
	const ip = getClientIp(req);

	res.on('finish', () => {
		const duration = Date.now() - startTime;
		const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms ${ip} ${username}`;

		if (res.statusCode >= 500) {
			logger.error(message);
			return;
		}

		if (res.statusCode >= 400) {
			logger.warn(message);
			return;
		}

		logger.info(message);
	});

	next();
};

module.exports = requestLogger;
