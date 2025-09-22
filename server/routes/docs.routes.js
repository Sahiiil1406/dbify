const {getDocs}=require('../controllers/docs-generator')
const express=require('express');
const router=express.Router();

router.get('/:projectId',getDocs);

module.exports=router;