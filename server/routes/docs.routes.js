const {getDocs}=require('../controllers/docs-generator')
const {visualizeSchema}=require('../controllers/visualiser')
const express=require('express');
const router=express.Router();

router.get('/visualize/:projectId',visualizeSchema);
router.get('/:projectId',getDocs);

module.exports=router;