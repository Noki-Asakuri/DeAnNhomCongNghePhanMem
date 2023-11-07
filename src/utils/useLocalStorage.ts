import { useState } from "react";

interface WindowWithLocalStorage extends Window {
	localStorage: Storage;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = (window as WindowWithLocalStorage).localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.log(error);
			return initialValue;
		}
	});

	const setValue = (value: T) => {
		try {
			const valueToStore = value instanceof Function ? (value(storedValue) as T) : value;
			setStoredValue(value);
			(window as WindowWithLocalStorage).localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.log(error);
		}
	};

	return [storedValue, setValue];
}
