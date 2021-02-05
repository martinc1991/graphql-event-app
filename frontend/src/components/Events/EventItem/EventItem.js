import React from 'react';
import './EventItem.css';

export default function EventItem(props) {
	return (
		<li key={props.eventId} className='events__list-item'>
			<div>
				<h1>{props.title}</h1>
				<h2>
					${Number.parseFloat(props.price).toFixed(2)} - {new Date(props.date).toLocaleDateString()} - Image: {props.image ? 'true' : 'false'}
				</h2>
			</div>
			<div>
				{props.userId === props.creatorId ? (
					<p>You're the owner of this event</p>
				) : (
					<button className='btn' onClick={props.onDetail.bind(this, props.eventId)}>
						View Details
					</button>
				)}
			</div>
		</li>
	);
}
