import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import logo from '../assets/easy-event-logo.png';

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
		color: 'rgb(0,0,0)',
		fontFamily: 'Hammersmith One',
		fontSize: '4rem',
	},
	mainBody: {
		color: 'rgb(0,0,0)',
		backgroundColor: 'white',
		fontFamily: 'Lora',
		fontSize: '1.5rem',
	},
	mainBodySpan: {
		color: 'darkorange',
		backgroundColor: 'white',
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
				{/* <h1 className={classes.mainTitle}>EasyEvent</h1> */}
				<img src={logo} alt='' height={100} />
				<p className={classes.mainBody}>
					The Events Application that makes it <span className={classes.mainBodySpan}>easy to arrange an event!</span>
				</p>
			</div>
		</div>
	);
}
