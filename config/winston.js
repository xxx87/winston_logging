let appRoot = require('app-root-path');
let moment = require('moment');
let util = require('util');

const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf} = format;

const myFormat = printf(({level, message, label, timestamp}) => {
	let formatDate = moment(timestamp).format('DD.MM.YYYY, HH:mm:ss.SSS');
	return `[${formatDate}] [${level}] : ${message}`;
});

let options = {
	file: {
		level: 'info',
		filename: `${appRoot}/logs/app.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
	},
	// console: {
	// 	level: 'debug',
	// 	handleExceptions: true,
	// 	json: false,
	// 	colorize: true,
	// },
};

let logger = createLogger({
	format: combine(
		// label({label: 'right meow!'}),
		timestamp(),
		myFormat
	),
	transports: [
		new transports.File(options.file),
		// new transports.Console(options.console)
	],
	exitOnError: false, // do not exit on handled exceptions
});

function formatArgs(args){
	return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}


console.error = function() {
	logger.error.apply(null, formatArgs(arguments));
};
console.warn = function() {
	logger.warn.apply(null, formatArgs(arguments));
};
console.info = function() {
	logger.info.apply(null, formatArgs(arguments));
};

// logger.stream = {
// 	write: function(message, encoding) {
// 		logger.info(message);
// 	},
// };

module.exports = logger;
