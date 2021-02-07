import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import background from '../assets/bg1.jpg';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		minHeight: '100vh',
		// backgroundImage: `url(${background})`,
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		width: '100%',
		// color: (props) => props.color,
	},
	titleContainer: {
		// border: '1px solid red',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	mainTitle: {
		color: 'white',
		fontFamily: 'Hammersmith One',
		fontSize: '4rem',
	},
	mainBody: {
		color: 'white',
		fontFamily: 'Lora',
		fontSize: '1.5rem',
	},
});
export default function HomePage() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<CssBaseline />
			<div className={classes.titleContainer}>
				<h1 className={classes.mainTitle}>EasyEvent</h1>
				<p className={classes.mainBody}>The Events Application that makes it easy to arrange an event!</p>
			</div>
		</div>
	);
}
