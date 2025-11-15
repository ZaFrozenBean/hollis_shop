import axios from "axios";

// Base API configuration
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

// Create axios instance with default config
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
	(config) => {
		const token =
			typeof window !== "undefined"
				? localStorage.getItem("authToken")
				: null;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized - clear token and redirect to login
			if (typeof window !== "undefined") {
				localStorage.removeItem("authToken");
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

// Response handler utilities
export const handleApiResponse = {
	success: (data, message = "Success") => ({
		success: true,
		data,
		message,
		error: null,
	}),

	error: (error, defaultMessage = "An error occurred") => ({
		success: false,
		data: null,
		message: error.response?.data?.message || error.message || defaultMessage,
		error: error.response?.data || error,
		statusCode: error.response?.status,
	}),
};

// Generic API methods
export const api = {
	// GET request
	get: async (endpoint, config = {}) => {
		try {
			const response = await apiClient.get(endpoint, config);
			return handleApiResponse.success(response.data);
		} catch (error) {
			return handleApiResponse.error(error);
		}
	},

	// POST request
	post: async (endpoint, data = {}, config = {}) => {
		try {
			const response = await apiClient.post(endpoint, data, config);
			return handleApiResponse.success(response.data);
		} catch (error) {
			return handleApiResponse.error(error);
		}
	},

	// PUT request
	put: async (endpoint, data = {}, config = {}) => {
		try {
			const response = await apiClient.put(endpoint, data, config);
			return handleApiResponse.success(response.data);
		} catch (error) {
			return handleApiResponse.error(error);
		}
	},

	// PATCH request
	patch: async (endpoint, data = {}, config = {}) => {
		try {
			const response = await apiClient.patch(endpoint, data, config);
			return handleApiResponse.success(response.data);
		} catch (error) {
			return handleApiResponse.error(error);
		}
	},

	// DELETE request
	delete: async (endpoint, config = {}) => {
		try {
			const response = await apiClient.delete(endpoint, config);
			return handleApiResponse.success(response.data);
		} catch (error) {
			return handleApiResponse.error(error);
		}
	},
};

// E-commerce specific API endpoints
export const productApi = {
	getAll: (params) => api.get("/products", { params }),
	getById: (id) => api.get(`/products/${id}`),
	create: (data) => api.post("/products", data),
	update: (id, data) => api.put(`/products/${id}`, data),
	delete: (id) => api.delete(`/products/${id}`),
	search: (query) => api.get("/products/search", { params: { q: query } }),
};

export const cartApi = {
	get: () => api.get("/cart"),
	add: (productId, quantity = 1) =>
		api.post("/cart/items", { productId, quantity }),
	update: (itemId, quantity) =>
		api.patch(`/cart/items/${itemId}`, { quantity }),
	remove: (itemId) => api.delete(`/cart/items/${itemId}`),
	clear: () => api.delete("/cart"),
};

export const orderApi = {
	getAll: (params) => api.get("/orders", { params }),
	getById: (id) => api.get(`/orders/${id}`),
	create: (data) => api.post("/orders", data),
	cancel: (id) => api.patch(`/orders/${id}/cancel`),
};

export const authApi = {
	login: (credentials) => api.post("/auth/login", credentials),
	register: (userData) => api.post("/auth/register", userData),
	logout: () => api.post("/auth/logout"),
	getProfile: () => api.get("/auth/profile"),
	updateProfile: (data) => api.put("/auth/profile", data),
};

export const userApi = {
	getById: (id) => api.get(`/users/${id}`),
	update: (id, data) => api.put(`/users/${id}`, data),
	getAddresses: (userId) => api.get(`/users/${userId}/addresses`),
	addAddress: (userId, address) =>
		api.post(`/users/${userId}/addresses`, address),
	updateAddress: (userId, addressId, data) =>
		api.put(`/users/${userId}/addresses/${addressId}`, data),
	deleteAddress: (userId, addressId) =>
		api.delete(`/users/${userId}/addresses/${addressId}`),
};

// Export the axios instance for custom use cases
export default apiClient;
