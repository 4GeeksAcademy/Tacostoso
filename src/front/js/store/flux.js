import toast from "react-hot-toast";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: null,
			token: localStorage.getItem("token") || null,
			message: null,
			tacos: [
				{
					id: 1,
					name: "Taco de Carnitas",
					description: "Un taco de carnitas es un taco que lleva carne de cerdo cocida en su propia grasa.",
					image_url: "https://img.freepik.com/foto-gratis/deliciosa-comida-callejera-naturaleza-muerta_23-2151535325.jpg?t=st=1726542687~exp=1726546287~hmac=d38d726de63f5ad9e944ddfccfee4ca5420044db53799f89a07e9262c3116aab&w=826"
				},
				{
					id: 2,
					name: "Taco de Barbacoa",
					description: "La barbacoa es un método de cocción de carnes que consiste en asarlas en un hoyo cubierto.",
					image_url: "https://i.pinimg.com/564x/2f/8f/bd/2f8fbd88f439fead732e62c7dfe788e4.jpg"
				},
				{
					id: 3,
					name: "Taco de Birria",
					description: "La birria es un platillo típico de México, que consiste en carne de chivo, borrego o res adobada.",
					image_url: "https://plus.unsplash.com/premium_photo-1681406995059-972cf4e86568?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				},
				{
					id: 4,
					name: "Taco de Cabeza",
					description: "El taco de cabeza es un taco que lleva carne de cabeza de res cocida. cebollas y cilantro.",
					image_url: "https://i.pinimg.com/564x/40/8c/24/408c24f87e6350a9d6f84f449e7a207b.jpg"
				},
			],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			newOrder: async (order) => {

				const store = getStore();

				if (!store.user) {
					toast.error("You must be logged in to order");
					return;
				};

				const resp = await fetch(process.env.BACKEND_URL + "/api/order", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						user_id: store.user.id,
						status: "pendiente",
						tortilla_id: order.tortilla,
						proteins: order.proteins,
						vegetables: order.veggie,
						cheeses: order.cheese,
						sauces: order.salsa
					})
				});

				if (resp.ok) {
					toast.success("Order sent!");
				} else {
					toast.error("Error sending order");
				}

				const data = await resp.json();
				console.log(data);


			},

			login: async (email, password) => {
				const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						password: password
					})
				});
				const data = await resp.json();

				localStorage.setItem("token", data.token);

				setStore({ token: data.token });
				setStore({ user: data.user });

				if (resp.ok) {
					toast.success("Logged in! 🎉");
				}
				else {
					toast.error("You shall not pass! 🧙‍♂️");
				}
			},

			logout: () => {
				localStorage.removeItem("token");
				setStore({ token: null });
				setStore({ user: null });
				toast.success("Logged out! 🎉");
			},

			getUserLogged: async () => {
				const resp = await fetch(process.env.BACKEND_URL + "/api/user", {
					headers: {
						Authorization: "Bearer " + getStore().token
					}
				});
				if (resp.ok) {
					toast.success("User logged in! 🎉");
				} else {
					localStorage.removeItem("token");
					setStore({ token: null });
				}
				const data = await resp.json();
				setStore({ user: data });
			},

			register: async (email, fullName, password) => {
				const resp = await fetch(process.env.BACKEND_URL + "/api/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						full_name: fullName,
						password: password
					})
				});
				const data = await resp.json();

				localStorage.setItem("token", data.token);

				setStore({ user: data.user });
				setStore({ token: data.token });

				if (resp.ok) {
					toast.success("User registered! 🎉");
				}
				else {
					toast.error("Error registering user 🛑");
				}
			}

		}
	};
};

export default getState;
