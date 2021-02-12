import React, { Component } from 'react';
// Material UI
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	textField: {
		fontFamily: 'Lora',
		width: '100%',
	},
	input: {
		color: 'rgb(0,0,0)',
		fontFamily: 'Lora',
		textAlign: 'center',
	},
});
export default function TextInput(props) {
	const classes = useStyles(props);
	return (
		<TextField
			id={props.id}
			label={props.label}
			variant={props.variant}
			size={props.size}
			color={props.color}
			onChange={props.onChange}
			className={classes.textField}
			InputProps={{
				className: classes.input,
			}}
			type={props.type || 'text'}
			required={props.required}
			multiline={props.multiline || false}
			rows={props.rows}
			rowsMax={props.rowsMax}
		/>
	);
}
