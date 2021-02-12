import React, { Component } from 'react';
// Material UI
import { Typography } from '@material-ui/core';
// Components
import EventList from '../components/Events/EventsList/EventList';
import TextInput from '../components/inputs/TextInput';
import CreateEventModal from '../components/Modals/CreateEventModal/CreateEventModal.js';
import Spinner from '../components/Spinner/Spinner';
import './Events.css';
// AuthContext;
import AuthContext from '../context/auth-context';

export default class EventsPage extends Component {
	state = {
		events: [],
		isLoading: false,
		search: '',
		filteredEvents: [],
		fileSelected: false,
	};

	isActive = true;

	static contextType = AuthContext;
	constructor(props) {
		super(props);
	}

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
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then((resData) => {
				const events = resData.data.events;
				if (this.isActive) {
					this.setState({ events: events, filteredEvents: events, isLoading: false });
				}
			})
			.catch((err) => {
				console.log(err);
				if (this.isActive) {
					this.setState({ isLoading: false });
				}
			});
	};

	componentWillUnmount() {
		this.isActive = false;
	}

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

	render() {
		return (
			<React.Fragment>
				{this.state.isLoading ? (
					<div className='root-only-spinner'>
						<Spinner />
					</div>
				) : (
					<div className='root'>
						<div className='title-container'>
							<div className='title'>
								<Typography variant='h2' component='h2'>
									Events
								</Typography>
							</div>

							<Typography className='' variant='h6' component='p'>
								<mark className='main-body'>
									Feel free to <span className='mainBodySpan'> look up for the event you want</span> without having to sing up (you will have to sign up to book them although).
								</mark>
							</Typography>
						</div>

						{this.context.token && (
							<div className='createEventContainer'>
								<div className='createEventTextContainer'>
									<Typography className='' variant='h6' component='p'>
										<mark className='main-body'>
											Or create <span className='mainBodySpan'> you own event</span> and share it with everybody!
										</mark>
									</Typography>
								</div>
								<div className='createEventButtonContainer'>
									{/* Create Event Modal */}
									<CreateEventModal eventId={'eventId'} title={'title'} description={'props.description'} userId={'props.userId'} creatorId={'props.creatorId'} creatorEmail={'props.creatorEmail'} price={17} date={'props.date'} image={'props.image'}></CreateEventModal>
								</div>
							</div>
						)}
						<div className='filter-container'>
							<TextInput id='outlined-basic' label='Filter events' variant='standard' size='small' color='primary' onChange={this.filterHandler} />
						</div>
						{/* EventList */}
						{this.state.filteredEvents.length > 0 ? <EventList events={this.state.filteredEvents.length > 0 ? this.state.filteredEvents : []} authUserId={this.context.userId} /> : <Typography variant='h4'>None of our events matches the filter you entered. Please try again.</Typography>}
					</div>
				)}
			</React.Fragment>
		);
	}
}
