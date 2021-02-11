import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	button: {
		cursor: 'pointer',
		display: 'inline-block',
		backgroundColor: 'darkorange',
		fontSize: '1.1rem',
		color: 'white',
		fontFamily: 'Lora',
		textTransform: 'none',
		textAlign: 'center',
		// height: '35px',
		margin: '5px',
		padding: '0px 5px',
		transition: '300ms all', // throws an error
		'&:hover': {
			color: 'black',
		},
	},
}));

export default function CustomButton(props) {
	const classes = useStyles();
	return (
		<Typography style={{ backgroundColor: props.color || classes.button.backgroundColor, maxWidth: props.maxWidth || '1000px' }} className={classes.button} onClick={props.onClick}>
			{props.children || 'Insert Text'}
		</Typography>
	);
}
