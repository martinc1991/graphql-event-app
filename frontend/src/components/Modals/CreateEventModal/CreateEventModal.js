import { Avatar, Backdrop, Card, Modal, Typography } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
// Components
import CustomButton from '../../../components/CustomButton/CustomButton.js';
import AuthContext from '../../../context/auth-context.js';
import PreviewEventItem from '../../Events/EventItem/PreviewEventItem.js';
import TextInput from '../../inputs/TextInput';

const imagePlaceholderUrl = 'https://res.cloudinary.com/graphql-events-app/image/upload/v1612888691/graphql-events-app/placeholder_bs9x8v.png';

const useStyles = makeStyles((theme) => ({
	cardcontent: {
		padding: 0,
		'&:last-child': {
			paddingBottom: 0,
		},
	},
	// Styles for the modal position on the page
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	// Styles for the modal content
	modalContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '80vw',
		maxHeight: '90vh',
		minHeight: '85vh',
		outline: 'none',
		borderRadius: '3px',
		backgroundColor: theme.palette.background.paper,
		padding: '10px 20px',
	},
	cardHeaderContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		height: '10vh',
		// border: '2px solid gold',
		padding: '0px',
	},
	titleContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// border: '1px dashed blue',
	},
	avatar: {
		width: '35px',
		height: '35px',
		backgroundColor: theme.palette.primary.main,
		zIndex: 0,
		fontSize: '20px',
		margin: '0px 10px 0px 0px',
		textAlign: 'center',
		// border: '1px solid red',
	},
	actionsContainer: {
		// border: '1px dashed blue',
	},
	cardContentContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'start',
		width: '100%',
		maxHeight: '80vh',
		// border: '2px solid purple',
		padding: '0px',
		overflow: 'scroll',
		'&:last-child': {
			paddingBottom: 0,
		},
	},
	leftColumn: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'start',
		alignItems: 'center',
		// border: '2px solid steelblue',
	},
	formContainer: {
		width: '80%',
		maxWidth: 400,
		// border: '1px solid red',
		marginRight: 25,
	},
	mainBodySpan: {
		backgroundColor: theme.palette.primary.main,
		color: 'white',
	},
	dateAndPriceContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// border: '1px solid red',
	},
	dateContainer: {
		// border: '1px solid blue',
		width: '50%',
	},
	priceContainer: {
		// border: '1px solid gold',
		width: '40%',
		marginTop: 4,
	},
	descriptionTextInput: {
		// width: '80%',
		fontFamily: 'Lora',
		border: '1px solid grey',
		borderRadius: 3,
		outline: 'none',
		'&:focus': {
			border: '2px solid darkorange',
			outline: 'none',
		},
	},
	imageInputButton: {
		fontFamily: 'Lora',
		borderRadius: 3,
		outline: 'none',
		'&:focus': {
			border: '2px solid darkorange',
			outline: 'none',
		},
	},
	rightColumn: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '25px 0px',
		// border: '1px solid red',
		backgroundColor: 'rgba(0,0,0,0.1)',
		borderRadius: 5,
		// borderLeft: '1px solid grey',
	},
}));

export default function DetailsModal(props) {
	const [formData, setFormData] = useState({
		title: '',
		price: 0,
		date: '',
		description: '',
		file: '',
	});

	const history = useHistory();

	// AuthContext
	const authContext = useContext(AuthContext);

	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
		setFormData({
			title: '',
			price: 0,
			date: '',
			description: '',
			file: null,
		});
	};

	const handleClose = () => {
		setOpen(false);
	};

	const inputChangeHandler = (e) => {
		if (e.target.id === 'price') {
			setFormData({
				...formData,
				[e.target.id]: +e.target.value,
			});
		} else if (e.target.id === 'file') {
			setFormData({
				...formData,
				[e.target.id]: e.target.files[0],
			});
		} else {
			setFormData({
				...formData,
				[e.target.id]: e.target.value,
			});
		}
	};

	const onFormSubmit = (e) => {
		// This method sends a request to 'http://localhost:8000/graphql' without using graphql. This is because when an image is in the request, the multerMiddleware catches this request, processes it and THEN send a mutation to graphql

		e.preventDefault();
		const formDataToSend = new FormData();
		const token = authContext.token;

		if (formData.file) {
			formDataToSend.append('eventImage', formData.file);
		} else {
			formDataToSend.append('eventImage', 'No image');
		}
		formDataToSend.append('title', formData.title);
		formDataToSend.append('description', formData.description);
		formDataToSend.append('price', formData.price);
		formDataToSend.append('date', formData.date);
		formDataToSend.append('token', 'Bearer ' + token);

		const config = {
			headers: {
				'content-type': 'multipart/form-data',
				Authorization: 'Bearer ' + token,
			},
		};

		axios
			.post('http://localhost:8000/graphql', formDataToSend, config)
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed with status: ' + res.status);
				}
				return res.data.data.createEvent;
			})
			.then((resData) => {
				alert('Event created successfully!');
				setOpen(false);
				history.push('/'); // for now
			})
			.catch((err) => {
				console.log('CATCH DEL FRONT');
				console.log(err);
			});
	};

	return (
		<div>
			{/* Button to open the modal */}
			<Typography>
				<CustomButton onClick={handleOpen}>Create Event</CustomButton>
			</Typography>

			{/* The actual modal */}
			<Modal
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}>
				<Card className={classes.modalContainer}>
					{/* Card Middle */}
					<CardContent className={classes.cardContentContainer}>
						<Grid container>
							<Grid item xs={12} md={7} className={classes.leftColumn}>
								{/* Left Column Header */}
								<div className={classes.cardHeaderContainer}>
									<div className={classes.titleContainer}>
										<Avatar aria-label='avatar' className={classes.avatar}>
											C
										</Avatar>
										<Typography variant='h4' color='primary'>
											Create Event
										</Typography>
									</div>
									<div className={classes.actionsContainer}>
										<IconButton aria-label='settings' className={classes.iconContainer}>
											<MoreVertIcon className={classes.icon} />
										</IconButton>
									</div>
								</div>
								<div className={classes.formContainer}>
									<Typography variant='body1'>
										Complete the form below and see how it will look like in the <span className={classes.mainBodySpan}> preview section at your right.</span>
									</Typography>
									<form action='' encType='multipart/form-data'>
										<div className='form-control'>
											<TextInput id='title' label='Title' name='title' variant='standard' size='small' type='text' color='primary' onChange={inputChangeHandler} />
										</div>
										{/* Date and Time Container */}
										<div className={classes.dateAndPriceContainer}>
											<div className={classes.dateContainer}>
												<div>
													<label htmlFor='date' style={{ fontSize: '1rem', fontFamily: 'Lora' }}>
														Date
													</label>
													<TextInput id='date' name='date' variant='standard' size='small' type='datetime-local' color='primary' onChange={inputChangeHandler} />
												</div>
											</div>

											<div className={classes.priceContainer}>
												<div className='form-control'>
													<TextInput id='price' label='Price' name='price' variant='standard' size='small' type='number' color='primary' onChange={inputChangeHandler} />
												</div>
											</div>
										</div>
										<div className='form-control'>
											<label htmlFor='description' style={{ fontSize: '1rem', marginTop: 10, marginBottom: 10, fontFamily: 'Lora' }}>
												Description
											</label>
											<textarea className={classes.descriptionTextInput} name='description' id='description' rows='4' onChange={inputChangeHandler} />
										</div>
										<div className='form-control'>
											<label htmlFor='image' style={{ fontSize: '1rem', marginTop: 10, fontFamily: 'Lora' }}>
												Image
											</label>
											<input type='file' id='file' name='eventImage' onChange={inputChangeHandler} accept='image/x-png,image/gif,image/jpeg' className={classes.imageInputButton} />
										</div>
									</form>
									<CustomButton onClick={onFormSubmit}>Create Event</CustomButton>
									<CustomButton onClick={handleClose}>Cancel</CustomButton>
								</div>
							</Grid>
							<Grid item xs={12} md={5} className={classes.rightColumn}>
								<PreviewEventItem title={formData.title.length > 0 ? formData.title : 'Title of the Event'} description={formData.description.length > 0 ? formData.description : 'Your description text will be shown here.'} price={formData.price} date={formData.date} image={imagePlaceholderUrl} />
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Modal>
		</div>
	);
}
