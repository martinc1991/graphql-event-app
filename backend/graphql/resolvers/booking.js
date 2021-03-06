const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
	bookings: async (args, req) => {
		// Protects this resolver from unauthenticated requests (check middlewares/is-auth.js)
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		try {
			const bookings = await Booking.find({ user: req.userId });
			return bookings.map((booking, i) => {
				return transformBooking(booking);
			});
		} catch (err) {
			console.log('Error del catch del back');
			console.log(err);
			throw err;
		}
	},

	bookEvent: async (args, req) => {
		// Protects this resolver from unauthenticated requests (check middlewares/is-auth.js)
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}

		const fetchedEvent = await Event.findOne({ _id: args.eventId });

		const booking = new Booking({
			user: req.userId,
			event: fetchedEvent,
		});

		const result = await booking.save();
		return transformBooking(result);
	},

	cancelBooking: async (args, req) => {
		// Protects this resolver from unauthenticated requests (check middlewares/is-auth.js)
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		try {
			const booking = await Booking.findById(args.bookingId).populate('event');
			const event = transformEvent(booking.event);
			await Booking.deleteOne({ _id: args.bookingId });
			return event;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
};
