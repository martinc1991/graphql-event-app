import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css';
import AuthContext from '../../context/auth-context.js';
// Material UI
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

const useStyles = makeStyles({
	root: {
		backgroundColor: 'transparent',
		boxShadow: 'none',
		padding: '0px',
		// border: '1px solid red',
	},
});

export default function MainNavigation(props) {
	const classes = useStyles();
	return (
		<AuthContext.Consumer>
			{(context) => {
				return (
					<AppBar position='fixed' className={classes.root}>
						<Toolbar>
							<div className='main-navigation__logo'>
								<NavLink to='/' exact={true}>
									EasyEvent
								</NavLink>
							</div>
							<div className='links-container'>
								<nav className='main-navigation__items'>
									<ul>
										<li className='links'>
											<NavLink to='/' exact={true}>
												Home
											</NavLink>
										</li>
										<li className='links'>
											<NavLink to='/events' exact={true}>
												Events
											</NavLink>
										</li>

										{context.token && (
											<li className='links'>
												<NavLink to='/bookings' exact={true}>
													Bookings
												</NavLink>
											</li>
										)}
									</ul>
								</nav>
								<div className='auth-container'>
									{!context.token ? (
										<li className='links'>
											<NavLink to='/auth' exact={true}>
												Authenticate
											</NavLink>
										</li>
									) : (
										<li className='links'>
											<button onClick={context.logout}>Logout</button>
										</li>
									)}
								</div>
							</div>
						</Toolbar>
					</AppBar>
				);
			}}
		</AuthContext.Consumer>
	);
}
