import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/Share';
import React from 'react';
import DetailsModal from '../../Modals/DetailsModal/DetailsModal.js';

const imagePlaceholderUrl = 'https://res.cloudinary.com/graphql-events-app/image/upload/v1612888691/graphql-events-app/placeholder_bs9x8v.png';

const useStyles = makeStyles((theme) => ({
	root: {
		// width: '30%',
		maxWidth: 450,
		margin: '10px auto',
		backgroundColor: 'rgba(255,255,255,0.95)',
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
		// cursor: 'pointer',
	},
	descriptionContainer: {
		height: '100px',
		// border: '1px solid red',
		// display: 'flex',
		// flexDirection: 'column',
		// justifyContent: 'center',
	},
	cardBottom: {
		padding: 0,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// border: '1px solid red',
	},
	cardPrice: {
		padding: 0,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		margin: '20px 0px',
		// border: '1px solid red',
	},
	price: {
		color: theme.palette.primary.main,
		fontSize: '1.6rem',
		margin: '0.1rem 1rem',
		marginLeft: '5px',
	},
	moreInfo: {
		color: theme.palette.primary.main,
		cursor: 'pointer',
		margin: '0px 10px',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
	cardHeader: {
		minHeight: '40px',
		paddingLeft: '10px',
		paddingRight: '0px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: '25px',
		height: '25px',
		backgroundColor: theme.palette.primary.main,
		zIndex: 0,
		fontSize: '15px',
		// border: '1px solid red',
	},
	dateCaption: {
		position: 'absolute',
		marginTop: '5px',
		marginLeft: '5px',
		backgroundColor: 'white',
		width: '100px',
		textAlign: 'center',
	},
}));

export default function EventItem(props) {
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState(false);
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	return (
		<Grid item xs={12} sm={6} md={4}>
			<Card className={classes.root}>
				<CardHeader
					avatar={
						<Avatar aria-label='recipe' className={classes.avatar}>
							{props.creatorEmail ? props.creatorEmail[0].toUpperCase() : 'U'}
						</Avatar>
					}
					className={classes.cardHeader}
					// action={
					// 	<IconButton aria-label='settings'>
					// 		<MoreVertIcon />
					// 	</IconButton>
					// }
					title={
						<Typography variant='h5' color='primary'>
							{/* {props.title + ' lorem ipsum 12345678'} */}
							{props.title.length > 40 ? props.title.substring(0, 40) + '...' : props.title}
						</Typography>
					}
					// subheader={<Typography variant='caption'>{new Date(props.date).toLocaleDateString()}</Typography>}
				/>
				<div>
					<Typography variant='caption' className={classes.dateCaption}>
						{new Date(props.date).toLocaleDateString()}
					</Typography>
					<CardMedia className={classes.media} image={props.image ? props.image : imagePlaceholderUrl} title={props.title} />
				</div>
				<CardContent className={classes.descriptionContainer}>
					<Typography variant='body1'>{props.description.length > 120 ? props.description.substring(0, 140) + '...' : props.description}</Typography>
				</CardContent>
				{/* Price */}
				<CardActions disableSpacing className={classes.cardPrice}>
					<div>
						<Typography variant='body1'>
							Price:<span className={classes.price}>{props.price ? '$ ' + props.price.toFixed(2) : 'Free'}</span>
						</Typography>
					</div>
				</CardActions>
				<CardActions disableSpacing className={classes.cardBottom}>
					<div>
						{/* Share icon */}
						<IconButton aria-label='share'>
							<ShareIcon />
						</IconButton>
					</div>
					<div>
						{/* More info link */}
						{/* <Typography className={classes.moreInfo} onClick={props.onDetail.bind(this, props.eventId)}>
							+ More info
						</Typography> */}
						<DetailsModal eventId={props.eventId} title={props.title} description={props.description} creatorId={props.creatorId} creatorEmail={props.creatorEmail} price={props.price} date={props.date} image={props.image}></DetailsModal>
					</div>
				</CardActions>
			</Card>
		</Grid>
	);
}
