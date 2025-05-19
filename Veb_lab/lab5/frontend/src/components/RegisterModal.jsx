import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/providers/AuthContext";

export default function RegisterModal() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { signUp } = useAuth();

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleRegister = (formData) => {
		signUp(formData)
			.then(() => {
				alert(`Дякуємо за реєстрацію!`);
				navigate("/");
			})
			.catch((err) => alert(`${err}`));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleRegister(formData);
	};

	return (
		<div className="modal" style={{ display: "block" }}>
			<div className="modal-content">
				<span
					className="close-btn"
					onClick={() => {
						navigate("/");
					}}
				>
					&times;
				</span>
				<h2>Реєстрація</h2>
				<form onSubmit={handleSubmit}>
					{/* <label>ПІБ:<br /><input type="text" name="fullname" required value={formData.fullname} onChange={handleChange} /></label><br /><br /> */}
					{/* <label>Телефон:<br /><input type="tel" name="phone" required pattern="^\+380\d{9}$" placeholder="+380XXXXXXXXX" value={formData.phone} onChange={handleChange} /></label><br /><br /> */}

					<label>
						Email:
						<br />
						<input
							type="email"
							name="email"
							required
							value={formData.email}
							onChange={handleChange}
						/>
					</label>
					<br />
					<br />
					<label>
						Password:
						<br />
						<input
							type="password"
							name="password"
							required
							value={formData.p}
							onChange={handleChange}
						/>
					</label>
					<br />
					<br />
					<button type="submit">Зареєструватися</button>
				</form>
			</div>
		</div>
	);
}
