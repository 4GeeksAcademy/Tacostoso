import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light border-bottom border-success">
			<div className="container">
				<Link to="/" className="text-decoration-none">
					<span className=" mb-0">
						<h1 className="text-success fs-2" >Tacostoso</h1>
					</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-success">
							Arma tu 🌮
						</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
