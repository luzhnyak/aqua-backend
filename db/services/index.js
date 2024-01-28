const userServices = require("./userServices");
const jwtServices = require("./jwtServices");
const waterServices = require('./waterSerwices');
const Email = require('./emailServices')

module.exports = {
    userServices,
  jwtServices,
  waterServices,
    Email,
};
