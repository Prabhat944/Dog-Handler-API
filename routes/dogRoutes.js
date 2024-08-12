const express = require('express');
const {uploadDogPic, deleteDogPic, updateDogPic, getDogPic, getAllDogPics} = require('../controllers/dogController');
const upload = require('../controllers/multerConfig');

const router = express.Router();

router.post('/new', upload.array('dogPic'), uploadDogPic);
router.delete('/remove/:id', deleteDogPic);
router.put('/update/:id', upload.single('dogPic'), updateDogPic);
router.get('/info/:id', getDogPic);
router.get('/list', getAllDogPics);

module.exports = router;
