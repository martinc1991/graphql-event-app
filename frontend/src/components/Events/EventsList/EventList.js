import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import EventItem from '../EventItem/EventItem';
import './EventList.css';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	gridContainer: {
		width: '100%',
		maxWidth: '1200px',
		// height: 1000,
		// border: '1px solid red',
	},
}));

export default function EventList(props) {
	const classes = useStyles();

	// events array
	const events = props.events.map((event) => {
		return <EventItem key={event._id} eventId={event._id} title={event.title} description={event.description} userId={props.authUserId} creatorId={event.creator._id} creatorEmail={event.creator.email} price={event.price} date={event.date} image={event.image} />;
	});

	return (
		<Grid container spacing={3} justify='center' className={classes.gridContainer}>
			{events}
		</Grid>
	);
}
