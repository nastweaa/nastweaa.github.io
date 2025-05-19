import {
	signInWithCustomToken,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [firebaseUser, setFirebaseUser] = useState(null);
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			setFirebaseUser(firebaseUser);
			setLoading(false);

			if (firebaseUser) {
				const userResponse = await fetch("http://localhost:5000/api/profile", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${firebaseUser.accessToken}`,
					},
				});
				const userData = await userResponse.json();
				if (!userResponse.ok) {
					throw new Error("Failed to fetch user data");
				}

				setUserData(userData);
			}
		});

		return () => unsubscribe();
	}, []);

	async function signUp({ email, password }) {
		try {
			const response = await fetch("http://localhost:5000/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				throw new Error("Registration failed");
			}

			// Після реєстрації можна автоматично залогінити користувача
			await signIn({ email, password });
		} catch (error) {
			console.error("Registration error:", error);
			throw error;
		}
	}

	async function signIn({ email, password }) {
		try {
			const response = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok || !data.token) {
				throw new Error(data.error || "Login failed");
			}

			await signInWithCustomToken(auth, data.token);
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	}

	async function logOut() {
		try {
			await signOut(auth);
			window.location.href = "/";
		} catch (error) {
			console.error("Logout error:", error);
			return error;
		}
	}

	async function saveUserToFirestore(userData) {
		try {
			const token = await firebaseUser.getIdToken();

			await fetch("http://localhost:5000/api/profile", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(userData),
			});

			setUserData(userData);
		} catch (error) {
			console.error("Помилка запису у Firestore:", error);
			return error;
		}
	}

	return (
		<AuthContext.Provider
			value={{
				firebaseUser,
				userData,
				loading,
				signUp,
				signIn,
				logOut,
				saveUserToFirestore,
			}}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
