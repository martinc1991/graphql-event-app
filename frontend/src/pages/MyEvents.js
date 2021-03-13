import React, { Component } from 'react';
import BookingList from '../components/Bookings/BookingList/BookingList';
import MyEventsList from '../components/Events/MyEvents/MyEventsList.js';
import EventList from '../components/Events/EventsList/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
// Material UI
import { Typography } from '@material-ui/core';
import TextInput from '../components/inputs/TextInput';
import './MyEvents.css';

export default class MyEventsPage extends Component {
	state = {
		isLoading: false,
		events: [],
		search: '',
		filteredEvents: [],
	};

	static contextType = AuthContext;

	componentDidMount() {
		this.fetchEvents();
	}

	fetchEvents = () => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
          query {
            events {
              _id
              title
              description
							date
							image
              price
              creator {
                _id
                email
              }
            }
          }
        `,
		};

		fetch('http://localhost:8000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this.context.token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					console.log(res);
					throw new Error('Failed! with status: ' + res.status);
				}
				return res.json();
			})
			.then((resData) => {
				let events = resData.data.events;
				console.log('events', events);

				events = events.filter((event) => {
					console.log('**********************');
					console.log(event.creator._id === this.context.userId);
					console.log('**********************');
					return event.creator._id === this.context.userId;
				});

				console.log('after filter events: ', events);
				this.setState({ events: events, filteredEvents: events, isLoading: false });
			})
			.catch((err) => {
				console.log(err);
				this.setState({ isLoading: false });
			});
	};

	filterHandler = (e) => {
		this.setState({ search: e.target.value.trim() });
		// If the TextInput filter is empty, set filteredEvents equal to events
		if (!e.target.value) {
			this.setState({ filteredEvents: this.state.events });
		} else {
			// Filtered events
			let filteredEvents = this.state.events.filter((event) => {
				return event.title.toLowerCase().includes(e.target.value.trim()) || event.description.toLowerCase().includes(e.target.value.trim());
			});
			this.setState({ filteredEvents: filteredEvents });
		}
	};

	deleteBookingHandler = (eventId) => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
          mutation {
            cancelBooking(bookingId: "${eventId}") {
              _id
							title
							}
          }
        `,
		};

		fetch('http://localhost:8000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this.context.token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then((resData) => {
				this.setState((prevState) => {
					const updatedEvents = prevState.events.filter((event) => {
						return event._id !== eventId;
					});
					return { events: updatedEvents, isLoading: false };
				});
			})
			.catch((err) => {
				console.log(err);
				this.setState({ isLoading: false });
			});
	};

	render() {
		return (
			<React.Fragment>
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<div className='eventsRoot'>
						<div className='eventsTitleContainer'>
							<div className='eventsTitle'>
								<Typography variant='h2'>My Events</Typography>
							</div>

							<Typography className='' variant='h6'>
								<mark className='eventsMainBody'>
									In this page <span className='eventsMainBodySpan'>you can edit you events.</span> Feel free to do as many changes as you want (you will not be able to change the price though).
								</mark>
							</Typography>
						</div>

						{/* Filter */}
						<div className='eventsFilterContainer'>
							<TextInput id='outlined-basic' label='Filter events' variant='standard' size='small' color='primary' onChange={this.filterHandler} />
						</div>

						{/* MyEventList */}
						<MyEventsList events={this.state.filteredEvents} onDelete={() => alert('Delete Handler')} />
					</div>
				)}
			</React.Fragment>
		);
	}
}
