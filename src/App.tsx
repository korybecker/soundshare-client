import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Upload from './pages/Upload';
import Sounds from './pages/Sounds';
import MyProfile from './pages/Profile/MyProfile';
import UserProfile from './pages/Profile/UserProfile';
import About from './pages/About';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
	return (
		<>
			<Navbar />
			<div className="App">
				<Routes>
					<Route path="/" element={<About />} />
					<Route path="/upload" element={<Upload />} />
					<Route path="/sounds" element={<Sounds />} />
					<Route path="/profile" element={<MyProfile />} />
					<Route path="/profile/:username" element={<UserProfile />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
