import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop.js';
import './Events.css';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventsList/EventList';
import Spinner from '../components/Spinner/Spinner';
import axios from 'axios';

export default class EventsPage extends Component {
	state = {
		creating: false,
		events: [],
		isLoading: false,
		selectedEvent: null,
		file: null,
	};

	isActive = true;

	static contextType = AuthContext;
	constructor(props) {
		super(props);
		this.titleElRef = React.createRef();
		this.priceElRef = React.createRef();
		this.dateElRef = React.createRef();
		this.descriptionElRef = React.createRef();
		this.imageElRef = React.createRef();
	}

	componentDidMount() {
		this.fetchEvents();
	}

	startCreateEventHandler = () => {
		this.setState({ creating: true });
	};

	// Upload image handler
	onChangeFile = (e) => {
		this.setState({ file: e.target.files[0] });
	};

	onFormSubmit = (e) => {
		e.preventDefault();

		const title = this.titleElRef.current.value;
		const price = +this.priceElRef.current.value;
		const date = this.dateElRef.current.value;
		const description = this.descriptionElRef.current.value;

		const formData = new FormData();

		const token = this.context.token;

		formData.append('eventImage', this.state.file);
		formData.append('title', title);
		formData.append('description', description);
		formData.append('price', price);
		formData.append('date', date);
		formData.append('token', 'Bearer ' + token);

		const config = {
			headers: {
				'content-type': 'multipart/form-data',
				Authorization: 'Bearer ' + token,
			},
		};

		axios
			.post('http://localhost:8000/graphql', formData, config)
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed with status: ' + res.status);
				}
				console.log(res.data.data.createEvent);
				return res.data.data.createEvent;
			})
			.then((resData) => {
				console.log('RESDATA', resData);
				this.setState((prevState) => {
					const updatedEvents = [...prevState.events];
					updatedEvents.push({
						_id: resData._id,
						title: resData.title,
						description: resData.description,
						date: resData.date,
						price: resData.price,
						image: resData.image,
						creator: {
							_id: this.context.userId,
						},
					});
					return { events: updatedEvents }; // this semicolon is SUPER important
				});

				alert('Event created successfully!');

				this.setState({ creating: false });
			})
			.catch((err) => {
				console.log('CATCH DEL FRONT');
				console.log(err);
			});
	};

	// Format submit handler
	modalConfirmHandler = (e) => {
		e.preventDefault();

		this.setState({ creating: false });
		const title = this.titleElRef.current.value;
		const price = +this.priceElRef.current.value;
		const date = this.dateElRef.current.value;
		const description = this.descriptionElRef.current.value;
		// const image = this.state.file;

		const formData = new FormData();

		if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
			return;
		}

		const requestBody = {
			query: `
          mutation CreateEvent($titleParameter: String!, $descriptionParameter: String!, $priceParameter: Float!, $dateParameter: String!) {
            createEvent(eventInput: {title: $titleParameter, description: $descriptionParameter, price: $priceParameter, date: $dateParameter}) {
              _id
              title
              description
              date
              price
            }
          }
				`,
			variables: {
				titleParameter: title,
				descriptionParameter: description,
				priceParameter: price,
				dateParameter: date,
			},
		};

		formData.append('eventImage', this.state.file);

		formData.append('body', requestBody);

		const token = this.context.token;

		fetch('http://localhost:8000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed with status: ' + res.status);
				}
				return res.json();
			})
			.then((resData) => {
				this.setState((prevState) => {
					const updatedEvents = [...prevState.events];
					updatedEvents.push({
						_id: resData.data.createEvent._id,
						title: resData.data.createEvent.title,
						description: resData.data.createEvent.description,
						date: resData.data.createEvent.date,
						price: resData.data.createEvent.price,
						creator: {
							_id: this.context.userId,
						},
					});
					return { events: updatedEvents }; // this semicolon is SUPER important
				});
			})
			.catch((err) => {
				console.log('CATCH DEL FRONT');
				console.log(err);
			});
	};
	modalCancelHandler = () => {
		this.setState({ creating: false, selectedEvent: null });
	};

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
					this.setState({ events: events, isLoading: false });
				}
			})
			.catch((err) => {
				console.log(err);
				if (this.isActive) {
					this.setState({ isLoading: false });
				}
			});
	};

	showDetailHandler = (eventId) => {
		this.setState((prevState) => {
			const selectedEvent = prevState.events.find((e) => e._id === eventId);
			return { selectedEvent: selectedEvent };
		});
	};

	bookEventHandler = () => {
		if (!this.context.token) {
			this.setState({ selectedEvent: null });
			return;
		}

		const requestBody = {
			query: `
          mutation BookEvent($idParameter: ID!) {
            bookEvent(eventId: $idParameter) {
              _id
							createdAt
							updatedAt
            }
          }
				`,
			variables: {
				idParameter: this.state.selectedEvent._id,
			},
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
				this.setState({ selectedEvent: null });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	componentWillUnmount() {
		this.isActive = false;
	}

	render() {
		return (
			<React.Fragment>
				{(this.state.creating || this.state.selectedEvent) && <Backdrop />}
				{this.state.creating && (
					<Modal title='Add Event' canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.onFormSubmit}>
						{/* <Modal title='Add Event' canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}> */}
						{/* Modal Content */}
						<form action='' encType='multipart/form-data'>
							<div className='form-control'>
								<label htmlFor='title'>Title</label>
								<input type='text' name='title' id='title' ref={this.titleElRef} />
							</div>
							<div className='form-control'>
								<label htmlFor='price'>Price</label>
								<input type='number' name='price' id='price' ref={this.priceElRef} />
							</div>
							<div className='form-control'>
								<label htmlFor='date'>Date</label>
								<input type='datetime-local' name='date' id='date' ref={this.dateElRef} />
							</div>
							<div className='form-control'>
								<label htmlFor='description'>Description</label>
								<textarea name='description' id='description' rows='4' ref={this.descriptionElRef} />
							</div>
							<div className='form-control'>
								<label htmlFor='description'>Image</label>
								<input
									type='file'
									name='eventImage'
									onChange={this.onChangeFile}
									// ref={this.imageElRef}
								/>
							</div>
						</form>
					</Modal>
				)}
				{this.state.selectedEvent && (
					<Modal title={this.state.selectedEvent.title} canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.bookEventHandler} confirmText={this.context.token ? 'Book' : 'Confirm'}>
						<h1>{this.state.selectedEvent.title}</h1>
						<h2>
							${Number.parseFloat(this.state.selectedEvent.price).toFixed(2)} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}
						</h2>
						<p>{this.state.selectedEvent.description}</p>
						<img src={this.state.selectedEvent.image} width='400' alt='' />
					</Modal>
				)}
				{this.context.token && (
					<div className='events-control'>
						<p>Share your own events!</p>
						<button className='btn' onClick={this.startCreateEventHandler}>
							Create Event
						</button>
					</div>
				)}
				{this.state.isLoading ? (
					<Spinner />
				) : (
					<div>
						<h1>Events</h1>
						<EventList events={this.state.events} authUserId={this.context.userId} onViewDetails={this.showDetailHandler} />
					</div>
				)}

				{/* <img src='https://res.cloudinary.com/graphql-events-app/image/upload/w_400/graphql-events-app/event-test_vunyr9.jpg' alt='' /> */}
			</React.Fragment>
		);
	}
}
// https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id>.<extension>
