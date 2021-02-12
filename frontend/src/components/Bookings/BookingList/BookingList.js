import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CustomButton from '../../CustomButton/CustomButton.js';
import DetailsModal from '../../Modals/DetailsModal/DetailsModal.js';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	bookingsList: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
		width: '40rem',
		maxWidth: '90%',
	},
	bookingsItem: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: '20px 0',
		padding: '0.5rem',
		// border: '1px solid darkorange',
		backgroundColor: 'rgba(255,255,255,0.95)',
		borderRadius: 3,
	},
	bookingDataContainer: {
		// border: '1px solid blue',
	},
	bookingActionsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// border: '1px solid blue',
	},
}));

export default function BookingList(props) {
	const classes = useStyles();
	return (
		<ul className={classes.bookingsList}>
			{props.bookings.map((booking) => {
				// console.log(booking.event);
				return (
					<li key={booking._id} className={classes.bookingsItem}>
						<div className={classes.bookingDataContainer}>
							<Typography variant='body1'>
								{booking.event.title} ({new Date(booking.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })})
							</Typography>
						</div>
						<div className={classes.bookingActionsContainer}>
							<DetailsModal eventId={booking.event._id} title={booking.event.title} description={booking.event.description} creatorEmail={booking.event.creator.email} price={booking.event.price} date={booking.event.date} image={booking.event.image}>
								See Details
							</DetailsModal>
							<CustomButton onClick={props.onDelete.bind(this, booking._id)}>Cancel booking</CustomButton>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
