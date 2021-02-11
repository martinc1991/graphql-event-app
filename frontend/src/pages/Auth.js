import React, { Component } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context.js';
import { Typography } from '@material-ui/core';
import TextInput from '../components/inputs/TextInput';
import CustomButton from '../components/CustomButton/CustomButton';

export default class AuthPage extends Component {
	state = {
		isLogin: true,
		email: '',
		password: '',
	};

	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.emailEl = React.createRef();
		this.passwordEl = React.createRef();
	}

	switchModeHandler = () => {
		this.setState((prevState) => {
			return {
				isLogin: !prevState.isLogin,
			};
		});
	};

	inputChangeHandler = (e) => {
		const inputType = e.target.type;
		this.setState({ [inputType]: e.target.value });
	};

	submitHandler = (event) => {
		event.preventDefault();
		// const email = this.emailEl.current.value;
		// const password = this.passwordEl.current.value;
		const email = this.state.email;
		const password = this.state.password;
		if (email.trim().length === 0 || password.trim().length === 0) {
			return;
		}

		let requestBody = {
			query: `
        query Login($emailParameter: String!, $passwordParameter: String!) {
          login(email: $emailParameter, password: $passwordParameter) {
            userId
            token
            tokenExpiration
          }
        }
      `,
			variables: {
				emailParameter: email,
				passwordParameter: password,
			},
		};

		if (!this.state.isLogin) {
			requestBody = {
				query: `
          mutation CreateUser($emailParameter: String!, $passwordParameter: String!) {
            createUser(userInput: {email: $emailParameter, password: $passwordParameter}) {
              _id
              email
            }
          }
        `,
				variables: {
					emailParameter: email,
					passwordParameter: password,
				},
			};
		}

		fetch('http://localhost:8000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then((resData) => {
				if (this.state.isLogin) {
					if (resData.data.login.token) {
						this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
					}
				} else {
					alert('User created correctly');
					this.setState({ isLogin: true });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		return (
			<div className='mainContainer'>
				<div className='titleContainer'>
					<div className='title'>
						<Typography variant='h2' component='h2'>
							{!this.state.isLogin ? 'Sign Up' : 'Login'}
						</Typography>
					</div>
					<Typography className='' variant='h6' component='p'>
						{this.state.isLogin ? (
							<mark className='main-body'>
								You are in <span className='mainBodySpan'> login mode.</span>
								<br /> You need to have an account before submitting the form below.
							</mark>
						) : (
							<mark className='main-body'>
								You are in <span className='mainBodySpan'> sign up mode.</span>
								<br /> Complete the form below to create an account and enjoy EaseEvent completely!
							</mark>
						)}
					</Typography>
				</div>
				<form className='form-container' onSubmit={this.submitHandler}>
					<div className='form-control'>
						<TextInput id='email' label='Email' variant='standard' size='small' color='primary' ref={this.emailEl} type='email' required onChange={this.inputChangeHandler} />
					</div>
					<div className='form-control'>
						<TextInput id='password' label='Password' variant='standard' size='small' color='primary' ref={this.passwordEl} type='password' required onChange={this.inputChangeHandler} />
					</div>
					<CustomButton onClick={this.submitHandler}>Submit</CustomButton>
				</form>
				<div className='changeButtonContainer'>
					<CustomButton onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Sign Up' : 'Login'}</CustomButton>
				</div>
			</div>
		);
	}
}
