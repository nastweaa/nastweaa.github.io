import { useEffect, useState } from "react";
import { useAuth } from "../auth";

export const HistoryPage = () => {
	const { firebaseUser } = useAuth();
	const [history, setHistory] = useState([]);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(10000);
	const [error, setError] = useState("");

	useEffect(() => {
		if (firebaseUser) {
			const fetchHistory = async () => {
				// Валідація
				if (minPrice < 0 || maxPrice < 0) {
					setError("Ціни не можуть бути від’ємними");
					return;
				}
				if (minPrice > maxPrice) {
					setError("Мінімальна ціна не може бути більшою за максимальну");
					return;
				}

				setError("");

				try {
					const token = await firebaseUser.getIdToken();
					const query = `?minPrice=${minPrice}&maxPrice=${maxPrice}`;

					const res = await fetch(`http://localhost:5000/api/rentals${query}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					});

					const data = await res.json();
					if (!res.ok) {
						throw new Error(data.error || "Failed to fetch history");
					}
					setHistory(data);
				} catch (error) {
					console.error("Error fetching history:", error);
				}
			};

			fetchHistory();
		}
	}, [firebaseUser, minPrice, maxPrice]);

	return (
		<div className="history-page" style={{ paddingTop: "40px" }}>
			<h1>Історія оренди</h1>

			<div className="filter-controls">
				<label>
					Мін. ціна:
					<input
						type="number"
						value={minPrice}
						min="0"
						onChange={(e) => setMinPrice(Number(e.target.value))}
					/>
				</label>
				<label>
					Макс. ціна:
					<input
						type="number"
						value={maxPrice}
						min="0"
						onChange={(e) => setMaxPrice(Number(e.target.value))}
					/>
				</label>
			</div>

			{error && <p className="error">{error}</p>}
			<div className="grid">
				{history.map((item, index) => {
					return (
						<div key={index} className={`item ${item.category}`}>
							<img src={item.image} alt={item.name} />
							<h3>{item.name}</h3>
							<p>Ціна: {item.price} грн/день</p>
							<p>Кількість: {item.quantity}</p>
							<p>Сума: {item.price * item.quantity} грн</p>
							<label>
								Початок:{" "}
								<input
									disabled
									type="date"
									className="start-date"
									value={item.startDate}
								/>
							</label>
							<label>
								Кінець:{" "}
								<input
									type="date"
									className="end-date"
									value={item.endDate}
									disabled
								/>
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
};
