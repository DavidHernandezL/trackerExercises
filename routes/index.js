const express = require('express');
const router = express.Router();
const home = require('../controllers/home');

module.exports = (app) => {
    
	router.get('/', home.index);
  router.get('/api/users', home.viewUsers);
  router.get('/api/users/:_id/logs',home.viewExercise);
  router.post('/api/users',home.createUser);
  router.post('/api/users/:_id/exercises',home.createExercise);
	app.use(router);
};