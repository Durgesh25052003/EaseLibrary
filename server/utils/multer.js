import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';


const storage= new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'library',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{width: 500, height: 750, crop: 'limit'},
        {quality: 'auto'}
        ],
    }
})

const upload= multer({storage})
export default upload;
