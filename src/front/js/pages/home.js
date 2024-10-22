import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

const Hero = () => {
	return (
		<div class="container my-5 alert alert-success border border-warning">
			<div class="p-5 text-center bg-body-tertiary rounded-3">
				<h1 class="text-body-emphasis alert-heading">¿Cansado de los mismos sabores? 🌮 </h1>
				<p class="lead">
					Donde cada taco es una fiesta para tus sentidos 🪅.
					<br />
					Prepárate para una explosión de sabores auténticos que te harán decir "¡wow!" en cada bocado.
				</p>
			</div>
		</div>
	);
};

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="d-flex flex-column justify-content-center w-full">
			<Hero />
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
		<div className="p-2 col-3 col-md-4 col-lg-3 col-sm-12 col-12"
			style={{
				minHeight: "400px",
			}}
		>
			<div className="card border border-success flex flex-column h-100">
				<img src={product.image_url} style={{
					maxHeight: "200px",
					objectFit: "cover"
				}} className="card-img-top" alt="..." />
				<div className=""
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "end",
						alignItems: "start",
						padding: "1rem",
						height: "100%"

					}}
				>
					<h5 className="card-title">{product.name}</h5>
					<p className="fs-5">{product.description}</p>
					<a href="#" className="btn btn-outline-success mt-auto">
						Agregar al carrito
					</a>
				</div>
			</div>
		</div>
	);
};

