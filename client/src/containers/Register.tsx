import { useState } from 'react';
import axios from 'axios';
import { URL } from '../config.ts';
import {useNavigate} from 'react-router'


const Register: React.FC = () => {
	const [ form, setValues ] = useState({
		email: '',
		password: '',
		password2: '',
		familyName: ''
	});
	
	const [ message, setMessage ] = useState('');

	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${URL}/register`, {
				email: form.email,
				password: form.password,
				password2: form.password2,
				family: form.familyName
			});
			setMessage(response.data.message);
			if (response.data.ok) {
				setTimeout(() => {
					navigate('/login');
				}, 2000);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form_container">
			<label>Email</label>
			<input
				name="email"
				type="email"
				value={form.email}
				onChange={handleChange}
				required
			/>

			<label>Password</label>
			<input
				name="password"
				type="password"
				value={form.password}
				onChange={handleChange}
				required
			/>

			<label>Repeat password</label>
			<input
				name="password2"
				type="password"
				value={form.password2}
				onChange={handleChange}
				required
			/>
			<label>Family Name</label>
			<input
				name="familyName"
				type="text"
				value={form.familyName}
				onChange={handleChange}
				required
			/>

			<button type="submit">register</button>
			<div className="message">
				<h4>{message}</h4>
			</div>
		</form>
	);
};

export default Register;