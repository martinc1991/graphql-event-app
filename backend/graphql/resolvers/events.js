const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const cloudinary = require('cloudinary').v2;

// Initial configuration for cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { transformEvent } = require('./merge');

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();
			return events.map((event) => {
				return transformEvent(event);
			});
		} catch (err) {
			throw err;
		}
	},

	createEvent: async (args, req) => {
		// Protects this resolver from unauthenticated requests (check middlewares/is-auth.js)
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date(args.eventInput.date),
			creator: req.userId,
			image: args.eventInput.image,
		});
		let createdEvent;
		try {
			const result = await event.save();
			createdEvent = transformEvent(result);
			const creator = await User.findById(req.userId);

			if (!creator) {
				throw new Error('User not found.');
			}
			creator.createdEvents.push(event);
			await creator.save();
			return createdEvent;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	deleteEvent: async (args, req) => {
		// Protects this resolver from unauthenticated requests (check middlewares/is-auth.js)
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}

		try {
			const eventToDelete = await Event.findOne({ _id: args.eventId });
			console.log('eventToDelete: ', eventToDelete);

			const pointPosition = eventToDelete.image.substring(71).indexOf('.');
			const publicID = eventToDelete.image.substring(71, 71 + pointPosition);

			if (publicID.startsWith('graphql-events-app/')) {
				const deletedBookings = await Booking.deleteMany({ event: args.eventId });
				console.log('deletedBookings: ', deletedBookings);

				const eventToDelete = await Event.findOneAndDelete({ _id: args.eventId });
				console.log('eventToDelete: ', eventToDelete);

				cloudinary.api.delete_resources([publicID], function (error, result) {
					if (error) {
						console.log('Error trying to delete the resource from Cloudinary');
						console.log(error);
					} else {
						console.log('Result:', result);
					}
				});
			}

			return {
				_id: eventToDelete?._id,
				title: eventToDelete?.title,
				description: eventToDelete?.description,
				price: eventToDelete?.price,
				date: eventToDelete?.date.toISOString(),
				creator: eventToDelete?.creator,
				image: eventToDelete?.image,
			};
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
