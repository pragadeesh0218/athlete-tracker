// Thin wrapper — actual storage handled by jsonDb
const db = require('../config/jsonDb');
module.exports = db.athletes;
