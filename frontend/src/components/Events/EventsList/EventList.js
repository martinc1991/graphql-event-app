import React from 'react';
import EventItem from '../EventItem/EventItem';
import './EventList.css';

export default function EventList(props) {
	const events = props.events.map((event) => {
		return <EventItem key={event._id} eventId={event._id} title={event.title} userId={props.authUserId} creatorId={event.creator._id} price={event.price} date={event.date} image={event.image} onDetail={props.onViewDetails} />;
	});
	return <ul className='event__list'>{events}</ul>;
}
