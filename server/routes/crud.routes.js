const {mainDBFunc}=require('../controllers/crud')
const router=require('express').Router();

router.post('/', mainDBFunc);

module.exports = router;