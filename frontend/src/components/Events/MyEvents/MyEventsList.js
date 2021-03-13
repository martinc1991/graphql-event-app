import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CustomButton from '../../CustomButton/CustomButton.js';
import DetailsModal from '../../Modals/DetailsModal/DetailsModal.js';
import { Typography } from '@material-ui/core';
import AuthContext from '../../../context/auth-context';

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

export default function MyEventsList(props) {
	const classes = useStyles();

	const auth_context = useContext(AuthContext);

	const deleteEventHandler = function (eventId) {
		// Confirm dialogue to delete the event
		if (!window.confirm('Do you really want to delete this event?')) {
			return;
		}
		// setState({ isLoading: true });
		console.log('context: ', auth_context);
		console.log('eventId: ', eventId);

		const requestBody = {
			query: `
          mutation {
						deleteEvent(eventId: "${eventId}") {
							_id
							title
							description
							price
							date
							image
						}
					}
        `,
		};

		console.log('requestBody: ', requestBody);

		fetch('http://localhost:8000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + auth_context.token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed with status ' + res.status);
				}
				return res.json();
			})
			.then((resData) => {
				alert('Event deleted successfully!');
			})
			.catch((err) => {
				console.log(err);
				// setState({ isLoading: false });
			});
	};

	return (
		<ul className={classes.bookingsList}>
			{props.events.map((event) => {
				console.table(event);
				return (
					<li key={event._id} className={classes.bookingsItem}>
						<div className={classes.bookingDataContainer}>
							<Typography variant='body1'>
								{event.title} ({new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'long' })})
							</Typography>
						</div>
						<div className={classes.bookingActionsContainer}>
							<DetailsModal eventId={event._id} title={event.title} description={event.description} creatorEmail={event.creator.email} price={event.price} date={event.date} image={event.image}>
								See Details
							</DetailsModal>
							<CustomButton onClick={() => deleteEventHandler(event._id)}>Delete event</CustomButton>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
