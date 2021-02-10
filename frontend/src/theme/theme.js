import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
	// <----------------------------------------- COLORS ----------------------------------------->
	palette: {
		// PRIMARY COLOR
		primary: {
			main: 'rgb(255,140,0)',
		},
		// SECONDARY COLOR
		secondary: {
			main: green[500],
		},
		// TEXT COLORS
		text: {
			primary: 'black',
			secondary: 'black',
			disabled: 'rgba(0, 0, 0, 0.38)',
			hint: 'rgba(0, 0, 0, 0.38)',
		},
	},
	// <----------------------------------------- TYPOGRAPHY ----------------------------------------->
	typography: {
		fontFamily: 'Lora',
		h1: {
			fontFamily: 'Hammersmith One',
			fontSize: '4rem',
		},
		h2: {
			fontFamily: 'Hammersmith One',
			fontSize: '3rem',
		},
		h3: {
			fontFamily: 'Hammersmith One',
			fontSize: '2rem',
		},
		h4: {
			fontFamily: 'Hammersmith One',
			fontSize: '1.5rem',
		},
		h5: {
			fontFamily: 'Hammersmith One',
			fontSize: '1.2rem',
			lineHeight: '1.2rem',
		},
		body1: {
			fontFamily: 'Lora',
			fontSize: '1rem',
			color: 'black',
		},
		caption: {
			fontFamily: 'Lora',
			fontSize: '0.9rem',
			color: 'rgb(26,26,26)',
		},
	},
});

export default theme;
