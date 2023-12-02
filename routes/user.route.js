const express = require('express');
const router = express.Router();
const multer = require('multer');
const diskStroage = multer.diskStorage({
 destination : (req,file,cb)=>{
  cb(null , 'uploads/profile')
 },
 filename : (req , file , cb)=>{
  console.log(file.originalname.split('.')[0]);
  const ext = file.mimetype.split('/')[1];
  const fileName = `${file.originalname.split('.')[0]}-profile-${Date.now()}.${ext}`
  cb(null , fileName)
 }
});
const fileFilter = (req , file , cb)=>{
 const imageType = file.mimetype.split('/')[0];
 if (imageType === 'image') {
  return cb(null , true)
 }else{
  cb("this file must be an image" , false)
 }
}
const upload = multer({storage : diskStroage , fileFilter});
const {getAllUsers , register , login ,update_image_prfile,
  updateUser , updatedEmail , deleteUser , profile} = require('../controller/user.controller');
const verifyToken = require('../middleWare/verifyToken');
const allowedTo = require('../middleWare/allowedTo');
router.route('/')
.get(verifyToken,allowedTo('admin','manager'),getAllUsers);

router.route('/register')
.post(upload.single('profile'),register);

router.route('/login')
.post(login);

router.route('/view/:id')
.get(verifyToken,profile);

router.route('/update-profile/:id')
.patch(verifyToken,upload.single('profile'),updateUser);

router.route('/updated/:id')
.patch(verifyToken,upload.single('profile'),updatedEmail);

router.route('/update-image-profile/:id')
.patch(verifyToken,upload.single('profile'),update_image_prfile);


router.route('/delete-profile/:id')
.delete(verifyToken,deleteUser);

module.exports = router;
