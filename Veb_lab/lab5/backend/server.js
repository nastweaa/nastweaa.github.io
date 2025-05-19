const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const verifyToken = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split("Bearer ")[1];
		if (!token) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const decodedToken = await admin.auth().verifyIdToken(token);
		if (!decodedToken) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		req.user = decodedToken;
		next();
	} catch (err) {
		console.error("Token verification failed:", err);
		res.status(401).json({ error: "Unauthorized" });
	}
};

app.get("/", (req, res) => {
	res.send("Сервер працює 🚀");
});

app.post("/api/register", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	try {
		const userRecord = await admin.auth().createUser({ email, password });
		await db.collection("users").doc(userRecord.uid).set({ email });
		res.status(201).json({ message: "User registered successfully" });
	} catch (err) {
		console.error("Registration error:", err);
		res.status(500).json({ error: "Registration failed" });
	}
});

app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	try {
		const response = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD5YSvOVi_YV7IBvO--2g-FvVxIPhYd_Kw`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password,
					returnSecureToken: true,
				}),
			},
		);

		const data = await response.json();
		console.log("data: ", data);
		if (!response.ok) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const customToken = await admin.auth().createCustomToken(data.localId);
		res.json({ token: customToken });
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ error: "Login failed" });
	}
});

app.get("/api/profile", verifyToken, async (req, res) => {
	try {
		const user = await db.collection("users").doc(req.user.uid).get();
		if (!user.exists) {
			return res.status(404).json({ error: "User not found" });
		}
		const userData = user.data();
		if (!userData) {
			return res.status(404).json({ error: "User data not found" });
		}

		res.json(userData);
	} catch (err) {
		console.error("Profile error:", err);
		res.status(500).json({ error: "Failed to fetch profile" });
	}
});

app.put("/api/profile", verifyToken, async (req, res) => {
	try {
		const { email, userName, age } = req.body;
		if (!email || !userName || !age) {
			return res.status(400).json({ error: "All fields are required" });
		}

		await db.collection("users").doc(req.user.uid).set(
			{
				email,
				userName,
				age,
			},
			{ merge: true },
		);

		res.json({ message: "Profile updated successfully" });
	} catch (err) {
		console.error("Profile error:", err);
		res.status(500).json({ error: "Failed to updated profile" });
	}
});

app.get("/api/rentals", verifyToken, async (req, res) => {
	const { minPrice = 0, maxPrice = 10000 } = req.query;

	try {
		// Отримуємо всі оренди, які належать користувачу
		const snapshot = await db
			.collection("rentals")
			.where("userId", "==", req.user.uid)
			.get();

		// Фільтрація по ціні вже після отримання з бази
		const rentals = snapshot.docs
			.map((doc) => ({ id: doc.id, ...doc.data() }))
			.filter(
				(item) =>
					typeof item.price === "number" &&
					item.price >= Number(minPrice) &&
					item.price <= Number(maxPrice),
			);

		res.json(rentals);
	} catch (error) {
		console.error("Error fetching rentals:", error);
		res.status(500).json({ error: "Error fetching rentals" });
	}
});

app.post("/api/rentals", verifyToken, async (req, res) => {
	try {
		for (const rental of req.body) {
			await db.collection("rentals").add({
				...rental,
				userId: req.user.uid,
				createdAt: new Date().toISOString(),
			});
		}

		res.status(201).json({ message: "Rental saved successfully" });
	} catch (error) {
		console.error("Error saving rental:", error);
		res.status(500).json({ error: "Failed to save rental" });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
