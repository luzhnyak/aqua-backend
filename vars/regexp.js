const  constants  = require("./constants");

exports.time = /^([0-9]{2}):([0-9]{2})$/;

exports.emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

exports.date = new RegExp(`^\\d{1,2}\\s(${constants.MONTH.join('|')})\\s\\d{4}`);

exports.dateParams = new RegExp(`^\\d{1,2}\\-(${constants.MONTH.join('|')})\\-\\d{4}`);