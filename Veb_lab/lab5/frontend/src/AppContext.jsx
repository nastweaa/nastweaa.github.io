import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [cart, setCart] = useState([]);

	const addToCart = (item) => {
		setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
	};

	return (
		<AppContext.Provider
			value={{
				setCart,
				cart,
				addToCart,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useApp = () => useContext(AppContext);
