const express = require('express');
const authenticate = require('../authenticate');
const Cars = require('../models/car');

const carRouter = express.Router();

carRouter.route('/')
  .get((req, res, next) => {
    Cars.find(req.query)
      .then(cars => {
        if (!cars.length) {
          let err = new Error('No cars found');
          err.status = 404;
          res.setHeader('Content-Type', 'Application/json');
          return res.json({ error: err.status, message: err.message });
        }
        let carsData = { cars };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'Application/json');
        res.json(carsData);
      }, (err) => next(err))
      .catch(err => next(err));
  })
  .post(authenticate.authenticateUser, (req, res, next) => {
    Cars.create(req.body)
      .then(car => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'Application/json');
        res.json(car);
      }, err => next(err))
      .catch(err => next(err));
  });

carRouter.route('/:id')
  .get((req, res, next) => {
    Cars.findById(req.params.id)
      .then((car) => {
        if (!car) {
          let err = new Error('Car not found');
          err.status = 404;
          res.setHeader('Content-Type', 'Application/json');
          return next(err);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'Application/json');
        res.json(car);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(authenticate.authenticateUser, (req, res, next) => {
    Cars.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .then((car) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'Application/json');
        res.json(car);
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete(authenticate.authenticateUser, (req, res, next) => {
    Cars.findByIdAndRemove(req.params.id)
      .then((car) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'Application/json');
        res.json(car);
      })
  });


module.exports = carRouter;
