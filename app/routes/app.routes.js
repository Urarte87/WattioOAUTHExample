module.exports = (app) => {
    const controller = require('../controllers/app.controller.js');
    app.get('/app', controller.findAll);
}