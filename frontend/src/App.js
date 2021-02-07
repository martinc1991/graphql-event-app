import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import HomePage from './pages/HomePage';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context.js';
import './App.css';
import { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';

class App extends Component {
	state = {
		token: null,
		userId: null,
	};
	login = (token, userId, tokenExpiration) => {
		this.setState({ token: token, userId: userId });
	};
	logout = () => {
		this.setState({ token: null, userId: null });
	};

	render() {
		return (
			<BrowserRouter>
				<AuthContext.Provider
					value={{
						token: this.state.token,
						userId: this.state.userId,
						login: this.login,
						logout: this.logout,
					}}
				>
					<main className='main-content'>
						<MainNavigation />
						<Switch>
							{/* If there's no user logged in */}
							<Route path='/' component={HomePage} exact />
							{/* {!this.state.token && <Redirect from='/' to='/events' exact />} */}
							{!this.state.token && <Redirect from='/bookings' to='/auth' exact />}
							{!this.state.token && <Route path='/auth' component={AuthPage} />}

							{/* If there's a user logged in */}
							{/* {this.state.token && <Redirect from='/' to='/events' exact />} */}
							{this.state.token && <Redirect from='/auth' to='/events' exact />}
							<Route path='/events' component={EventsPage} />
							{this.state.token && <Route path='/bookings' component={BookingsPage} />}
							{!this.state.token && <Redirect to='/auth' exact />}
						</Switch>
					</main>
				</AuthContext.Provider>
			</BrowserRouter>
		);
	}
}

export default App;
