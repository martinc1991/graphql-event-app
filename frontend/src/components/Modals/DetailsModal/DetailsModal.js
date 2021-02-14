import { Avatar, Backdrop, Card, Modal, Typography } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import GradeIcon from '@material-ui/icons/Grade';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import React, { useContext } from 'react';
import AuthContext from '../../../context/auth-context.js';
import CustomButton from '../../CustomButton/CustomButton.js';

const imagePlaceholderUrl = 'https://res.cloudinary.com/graphql-events-app/image/upload/v1612888691/graphql-events-app/placeholder_bs9x8v.png';

const useStyles = makeStyles((theme) => ({
	cardcontent: {
		padding: 0,
		'&:last-child': {
			paddingBottom: 0,
		},
	},
	// Styles for the button that open the modal
	moreInfoButton: {
		color: theme.palette.primary.main,
		cursor: 'pointer',
		margin: '0px 10px',
		'&:hover': {
			textDecoration: 'underline',
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
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '80vw',
		maxHeight: '90vh',
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
		maxHeight: '70vh',
		// border: '2px solid blue',
		padding: '0px',
		overflow: 'scroll',
	},
	leftColumn: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'start',
		alignItems: 'start',
		// border: '2px solid steelblue',
	},
	infoTextBlock: {
		// border: '1px solid red',
		marginTop: '3px',
		marginBottom: '3px',
		marginRight: '2px',
	},
	price: {
		color: theme.palette.primary.main,
		fontSize: '1.6rem',
		margin: '0.1rem 1rem',
		marginLeft: '5px',
	},
	rightColumn: {
		// border: '1px solid red',
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
		borderRadius: '5px',
	},
	cardBottomContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		width: '100%',
		height: '8vh',
		// border: '2px solid gold',
		padding: '0px',
		'&:last-child': {
			paddingBottom: '5px',
		},
	},
	bottomLeftColumn: {
		// border: '2px solid steelblue',
	},
	bottomRightColumn: {
		// border: '2px solid steelblue',
	},
	icon: {
		color: 'rgba(0,0,0,0.3)',
	},
	iconContainer: {
		backgroundColor: 'white',
		transition: '300ms all ease-in-out', // throws an error
		'&:hover': {
			backgroundColor: 'rgb(255,140,0,0.5)',
		},
	},
}));

export default function DetailsModal(props) {
	// AuthContext
	const authContext = useContext(AuthContext);

	// console.log('props.creatorId = ', props.creatorId);
	// console.log('authContext.userId = ', authContext.userId);
	// console.log(authContext.userId === props.creatorId, props.title);

	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const bookEventHandler = () => {
		if (!authContext.token) {
			// this.setState({ selectedEvent: null });
			return;
		}

		// console.log('REQUEST PROPS', props);

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
				idParameter: props.eventId,
			},
		};
		// idParameter: this.state.selectedEvent._id,

		fetch('http://localhost:8000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + authContext.token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then((resData) => {
				alert('event booking succeded');
				setOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div>
			{/* Button to open the modal */}
			<Typography>
				<a type='button' onClick={handleOpen} className={classes.moreInfoButton}>
					{props.children ? props.children : '+ More Info'}
				</a>
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
				}}
			>
				<Card className={classes.modalContainer}>
					<div className={classes.cardHeaderContainer}>
						<div className={classes.titleContainer}>
							<Avatar aria-label='recipe' className={classes.avatar}>
								{props.creatorEmail ? props.creatorEmail[0].toUpperCase() : 'U'}
							</Avatar>
							<Typography variant='h4' color='primary'>
								{/* {props.title + ' lorem ipsum 12345678'} */}
								{props.title.length > 40 ? props.title.substring(0, 40) + '...' : props.title}
							</Typography>
						</div>
						<div className={classes.actionsContainer}>
							<IconButton aria-label='settings' className={classes.iconContainer}>
								<MoreVertIcon className={classes.icon} />
							</IconButton>
						</div>
					</div>
					{/* Card Middle */}
					<CardContent className={classes.cardContentContainer}>
						<Grid container>
							<Grid item xs={12} md={5} className={classes.leftColumn}>
								<Typography variant='body1' className={classes.infoTextBlock}>
									<b>Creator: </b>
									{props.creatorEmail}
								</Typography>
								<Typography variant='body1' className={classes.infoTextBlock}>
									<b>Date: </b>
									{new Date(props.date).toLocaleDateString('en-US', { dateStyle: 'full' }) + ' at ' + new Date(props.date).toTimeString().substr(0, 5)}
								</Typography>
								<Typography variant='body1' className={classes.infoTextBlock}>
									<b>Description: </b>
									{props.description}
									{/* {props.description + props.description + props.description} */}
								</Typography>
								<Typography variant='body1' className={classes.infoTextBlock}>
									<b>Price: </b>
									<span className={classes.price}>{props.price ? '$ ' + props.price.toFixed(2) : 'Free'}</span>
								</Typography>
							</Grid>
							<Grid item xs={12} md={7} className={classes.rightColumn}>
								<CardMedia className={classes.media} image={props.image ? props.image : imagePlaceholderUrl} title={props.title} />
							</Grid>
						</Grid>
					</CardContent>
					{/* Card Bottom */}
					<CardContent className={classes.cardBottomContainer}>
						<div className={classes.bottomLeftColumn}>
							<IconButton aria-label='settings' className={classes.iconContainer}>
								<FavoriteIcon className={classes.icon} />
							</IconButton>
							<IconButton aria-label='settings' className={classes.iconContainer}>
								<ShareIcon className={classes.icon} />
							</IconButton>
							<IconButton aria-label='settings' className={classes.iconContainer}>
								<GradeIcon className={classes.icon} />
							</IconButton>
						</div>
						<div className={classes.bottomRightColumn}>
							{authContext.token && authContext.userId !== props.creatorId && <CustomButton onClick={bookEventHandler}>Book</CustomButton>}
							<CustomButton onClick={handleClose}>Close</CustomButton>
						</div>
					</CardContent>
				</Card>
			</Modal>
		</div>
	);
}
