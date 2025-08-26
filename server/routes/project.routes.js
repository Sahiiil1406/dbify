const router=require('express').Router();
const { createProject, updateProject, deleteProject, getProject, getMyProjects }=require('../controllers/project.js');
const { authenticateToken }=require('../middleware/user.middleware.js');

router.post('/', authenticateToken, createProject);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);
router.get('/:id', authenticateToken, getProject);
router.get('/', authenticateToken, getMyProjects);

module.exports = router;