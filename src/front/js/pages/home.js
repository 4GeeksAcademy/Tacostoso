import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

const Jumbotron = () => {

	return (
		<div className="alert alert-success border border-warning col-10 mx-auto mt-3 p-5" role="alert">
			<h1 className="alert-heading">¿Cansado de los mismos sabores? 🌮 </h1>
			<p>
				Donde cada taco es una fiesta para tus sentidos 🪅.
				<br />
				Prepárate para una explosión de sabores auténticos que te harán decir "¡wow!" en cada bocado.
			</p>
			<hr />
			<p className="mb-0">Ni tan costoso!.</p>
		</div>
	);
};

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="d-flex flex-column justify-content-center w-full">
			<Jumbotron />
			<div className="container">
				<div className="d-flex flex-wrap">
					{store.tacos.map((product, index) => {
						return <ProductCard key={index} product={product} />;
					})}
				</div>
			</div>
		</div>
	);
};

const ProductCard = ({ product }) => {
	return (
		<div className="p-2 col-3">
			<div className="card border border-success">
				<img src={product.image_url} style={{
					maxHeight: "300px",
					objectFit: "cover"
				}} className="card-img-top" alt="..." />
				<div className="card-body">
					<h5 className="card-title">{product.name}</h5>
					<p className="card-text">{product.description}</p>
					<a href="#" className="btn btn-outline-success">
						Agregar al carrito
					</a>
				</div>
			</div>
		</div>
	);
};

