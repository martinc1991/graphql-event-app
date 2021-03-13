const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Initial configuration for cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res, next) => {
	if (!req.file) {
		next();
	} else {
		const title = req.body.title;
		const description = req.body.description;
		const date = req.body.date;
		const price = req.body.price;

		// Read file from upload folder
		const filesRead = fs.readdirSync(__dirname + '/uploads');

		const publicID = 'graphql-events-app/' + title.replace(/ /g, '-') + '-' + Math.round(Math.random() * 10e10); // title + random number (/ /g means "match every ' ' character")
		console.log('publicID: ', publicID);

		let uploadedImage;

		try {
			// Upload image to cloudinary
			uploadedImage = await cloudinary.uploader.upload(
				__dirname + '/uploads/' + filesRead[0],
				{
					resource_type: 'image',
					public_id: publicID,
					overwrite: true,
					// notification_url: 'https://mysite.example.com/notify_endpoint',
				},
				function (error, result) {
					if (error) {
						console.log('ERROR DEL TRY', error);
					}
				}
			);
		} catch (error) {
			console.log('multer middleware CATCH', error);
		}

		console.log('UPLOADED IMAGE: ', uploadedImage);

		// Remove image from upload folder
		fs.rm(__dirname + '/uploads/' + filesRead[0], (error) => {
			if (error) {
				console.log('couldnt remove image', error);
			} else {
				console.log('Image removed successfully from uploads folder');
			}
		});

		// Change req.body so graphQL is able to process it correctly in the next middleware
		req.body = {
			query: `mutation CreateEvent($titleParameter: String!, $descriptionParameter: String!, $priceParameter: Float!, $dateParameter: String!, $imageParameter: String) {
    createEvent(eventInput: {title: $titleParameter, description: $descriptionParameter, price: $priceParameter, date: $dateParameter, image: $imageParameter}) {
       _id
       title
       description
       date
       price
       image
    }
  }`,
			variables: {
				titleParameter: title,
				descriptionParameter: description,
				priceParameter: +price,
				dateParameter: date,
				imageParameter: uploadedImage.secure_url,
			},
		};

		next();
	}
};
