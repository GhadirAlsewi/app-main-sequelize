var express = require('express');
var router = express.Router();
var { store, show, index, destroy, update, login } = require('../controllers/memberController');
// const isAdmin = require('../middlewares/isAdmin');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isAuthorized = require('../middlewares/isAuthorized');

router.post('/', store)
router.get('/:id', show)
router.get('/', index)
// router.delete('/:id', isAuthenticated, isAdmin, destroy)
router.delete('/:id', isAuthenticated, isAuthorized, destroy)
router.put('/:id', isAuthenticated, isAuthorized, update)
router.post('/login', login)

module.exports = router;
