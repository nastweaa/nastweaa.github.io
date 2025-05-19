import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { useAuth } from "../auth";

export default function CartModal() {
	const navigate = useNavigate();
	const { cart, setCart } = useApp();
	const { firebaseUser } = useAuth();
	const formatDate = (dateString) => {
		const [year, month, day] = dateString.split("-");
		return `${day}.${month}.${year}`;
	};

	function calculateDaysBetween(startDate, endDate) {
		const start = new Date(startDate);
		const end = new Date(endDate);

		start.setHours(0, 0, 0, 0);
		end.setHours(0, 0, 0, 0);

		const diffTime = end - start;
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 1 its first day of rant
	}

	const increaseQuantity = (index) => {
		const updatedCart = [...cart];
		updatedCart[index].quantity += 1;
		setCart(updatedCart);
	};

	const decreaseQuantity = (index) => {
		const updatedCart = [...cart];
		updatedCart[index].quantity -= 1;
		if (updatedCart[index].quantity <= 0) {
			updatedCart.splice(index, 1);
		}
		setCart(updatedCart);
	};

	const getTotal = () => {
		return cart.reduce((total, item) => {
			const daysCount = calculateDaysBetween(item.startDate, item.endDate);
			return total + item.price * daysCount * item.quantity;
		}, 0);
	};

	const onClose = () => {
		navigate("/");
	};

	const handleCheckout = () => {
		if (!firebaseUser) {
			navigate("/signin");
			return;
		}
		navigate("/payment");
	};
	return (
		<div className="modal" style={{ display: "block" }}>
			<div className="modal-content">
				<span className="close-btn" onClick={onClose}>
					&times;
				</span>
				<h2>Ваш кошик</h2>
				<div id="cart-list">
					{!cart || !cart.length ? (
						<p>Кошик порожній.</p>
					) : (
						cart.map((item, index) => (
							<div className="cart-item" key={index}>
								<div
									style={{ display: "flex", alignItems: "center", gap: "16px" }}
								>
									<img
										src={item.image}
										alt={item.name}
										style={{
											width: 80,
											height: 80,
											objectFit: "cover",
											borderRadius: 6,
										}}
									/>
									<div style={{ textAlign: "left" }}>
										<div>
											<strong>{item.name}</strong>
										</div>
										<div>
											Оренда: {formatDate(item.startDate)} —{" "}
											{formatDate(item.endDate)}
										</div>
										<div>Ціна: {item.price} грн/день</div>
									</div>
									<div
										style={{
											marginLeft: "auto",
											display: "flex",
											alignItems: "center",
											gap: 10,
										}}
									>
										<button onClick={() => decreaseQuantity(index)}>🗑</button>
										<span>{item.quantity}</span>
										<button onClick={() => increaseQuantity(index)}>➕</button>
									</div>
								</div>
							</div>
						))
					)}
				</div>
				<div
					id="cart-getTotal()"
					style={{
						textAlign: "right",
						marginTop: 20,
						fontSize: 18,
						fontWeight: "bold",
					}}
				>
					Загальна сума: {getTotal()} грн
				</div>
				<div style={{ textAlign: "right", marginTop: 20 }}>
					<button
						onClick={handleCheckout}
						style={{
							padding: "10px 20px",
							fontSize: 16,
							border: "none",
							borderRadius: 6,
							backgroundColor: "#007bff",
							color: "white",
							cursor: "pointer",
						}}
					>
						🛍️ Оформити замовлення
					</button>
				</div>
			</div>
		</div>
	);
}
