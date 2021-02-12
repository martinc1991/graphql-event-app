import React, { Component } from 'react';
import BookingList from '../components/Bookings/BookingList/BookingList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
// Material UI
import { Typography } from '@material-ui/core';
import TextInput from '../components/inputs/TextInput';

export default class BookingsPage extends Component {
	state = {
		isLoading: false,
		bookings: [],
		search: '',
		filteredBookings: [],
	};

	static contextType = AuthContext;

	componentDidMount() {
		this.fetchBookings();
	}

	fetchBookings = () => {
		this.setState({ isLoading: true });

		console.log('userId: ' + this.context.userId);
		console.log('token: ' + this.context.token);

		const requestBody = {
			query: `
          query {
            bookings {
              _id
							createdAt
							event {
								_id
								title
								description
								date
								price
								creator {
        					email
      					}
								image
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
				const bookings = resData.data.bookings;
				this.setState({ bookings: bookings, filteredBookings: bookings, isLoading: false });
			})
			.catch((err) => {
				console.log(err);
				this.setState({ isLoading: false });
			});
	};

	filterHandler = (e) => {
		this.setState({ search: e.target.value.trim() });
		// console.log('this.state.bookings', this.state.bookings);
		// return;
		// If the TextInput filter is empty, set filteredBookings equal to bookings
		if (!e.target.value) {
			this.setState({ filteredBookings: this.state.bookings });
		} else {
			// Filtered bookings
			let filteredBookings = this.state.bookings.filter((booking) => {
				return booking.event.title.toLowerCase().includes(e.target.value.trim()) || booking.event.description.toLowerCase().includes(e.target.value.trim());
			});
			this.setState({ filteredBookings: filteredBookings });
		}
	};

	deleteBookingHandler = (bookingId) => {
		this.setState({ isLoading: true });
		const requestBody = {
			query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
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
					const updatedBookings = prevState.bookings.filter((booking) => {
						return booking._id !== bookingId;
					});
					return { bookings: updatedBookings, isLoading: false };
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
					<div className='root'>
						<div className='title-container'>
							<div className='title'>
								<Typography variant='h2' component='h2'>
									Bookings
								</Typography>
							</div>

							<Typography className='' variant='h6' component='p'>
								<mark className='main-body'>
									All the <span className='mainBodySpan'> events you booked</span> will appear below. Feel free to book as many as you want.
								</mark>
							</Typography>
						</div>

						{/* Filter */}
						<div className='filter-container'>
							<TextInput id='outlined-basic' label='Filter bookings' variant='standard' size='small' color='primary' onChange={this.filterHandler} />
						</div>

						{/* Bookings List */}
						<BookingList bookings={this.state.filteredBookings} onDelete={this.deleteBookingHandler} />
					</div>
				)}
			</React.Fragment>
		);
	}
}
