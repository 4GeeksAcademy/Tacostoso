import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";


export const Navbar = () => {

	const { store, actions } = useContext(Context);

	return (
		<nav className="navbar navbar-light bg-light border-bottom border-success">
			<div className="container">
				<Link to="/" className="text-decoration-none">
					<span className=" mb-0">
						<h1 className="text-success fs-2" >Tacontodo</h1>
					</span>
				</Link>
				<div className="ml-auto flex">

					{
						!store.user && <div class="spinner-grow text-success spinner-grow-sm" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					}
					{
						store.user && <Link to="/profile" className="mx-1">
							{store.user.full_name}
						</Link>
					}

					<Link to="/order">
						<button className="btn btn-outline-success mx-1">
							Arma tu 🌮
						</button>
					</Link>


					{!store.token && <Link to="/login">
						<button className="btn btn-success mx-1">
							Login
						</button>
					</Link>}
					{store.token && <button className="btn btn-danger mx-1" onClick={() => actions.logout()}>
						Logout
					</button>}
				</div>
			</div>
		</nav>
	);
};
