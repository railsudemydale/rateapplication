const User = require('../models/user');
const Company = require('../models/company');
const cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,      
    api_secret: process.env.API_SECRET  
});

// cloudinary.config({
//     cloud_name: 'rateapplication',
//     api_key: '731853561426971',
//     api_secret:'fD2EgPZfBQmXjxuX0ytzv2TLoFk'
// });


exports.addImage = async (req, res) => {
    console.log(req.body);
    cloudinary.uploader.upload(req.body.image, (result) => {
        console.log(result);
        const savedData = async () => {
            if(req.body.image){
                await User.update({
                    '_id': req.body.user._id
                }, {
                    "imageId": result.public_id,
                    "imageVersion": result.version
                });
            }
        }

        savedData()
            .then(result => {
                return res.status(200).json({message: 'Profile image uploaded'});
            })
    });
}

exports.addLogo = async (req, res) => {
    cloudinary.uploader.upload(req.body.image, (result) => {
        const savedData = async () => {
            if(req.body.image){
                await Company.update({
                    '_id': req.body.company
                }, {
                    "imageId": result.public_id,
                    "imageVersion": result.version
                });
            }
        }

        savedData()
            .then(result => {
                return res.status(200).json({message: 'Company logo uploaded'});
            })
    });
}