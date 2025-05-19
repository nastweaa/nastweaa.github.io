import { Link } from "react-router-dom";
import { useAuth } from "../auth/providers/AuthContext";

export default function Header() {
	const { firebaseUser, userData, logOut } = useAuth();

	return (
		<div className="top-footer">
			<div className="logo">SportX</div>
			<div className="search-bar">
				<input type="text" placeholder="Пошук..." />
			</div>
			<div className="icons">
				<Link to="/cart">🛒 Кошик</Link>
				{userData ? (
					<>
						👤<Link to="/profile">{userData?.userName || "Користувач"}</Link>{" "}
						<Link to="/history">📜 Мої оренди</Link>
						<button onClick={logOut}>Вийти</button>{" "}
					</>
				) : firebaseUser ? (
					<>
						<Link to="/profile">👤 Профіль</Link>
						<Link to="/history">📜 Мої оренди</Link>
					</>
				) : (
					<div>
						{" "}
						<Link to="/register">🔑 Реєстрація</Link>{" "}
						<Link to="/signin">🔓 Увійти</Link>{" "}
					</div>
				)}
			</div>
		</div>
	);
}
