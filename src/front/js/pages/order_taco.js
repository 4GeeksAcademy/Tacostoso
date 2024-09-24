import React, { useContext } from "react";
import { Context } from "../store/appContext";
import toast from 'react-hot-toast';

const IngredientRadius = ({ name, price, tortillaValue, onUnChecked, tortillaId }) => {
    return (
        <div className="col-12 my-2">
            <div className="row border-bottom border-dark">
                <div className="col-6 m-0 p-0">
                    <h2 className="fs-4 fw-lighter">{name}</h2>
                </div>
                <div className="form-check col-6 justify-content-end d-flex">
                    <input className="form-check-input form-check-input-checked-bg-success"
                        type="checkbox" checked={tortillaValue == tortillaId} id={"tortilla-" + name}
                        onChange={(e) => {
                            onUnChecked();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const IngredientOption = ({ name, price, type, onSelect }) => {

    return (<>
        <div className="col-12 my-2">
            <div className="row border-bottom border-dark">
                <div className="col-6 m-0 p-0">
                    <h2 className="fs-4 fw-lighter">{name}</h2>
                </div>
                <div className="form-check col-6 justify-content-end d-flex">
                    <input className="form-check-input form-check-input-checked-bg-success" type="checkbox" value={name} id={name}
                        onChange={(e) => {
                            onSelect(e.target.checked);
                        }}
                    />
                </div>
            </div>
        </div>
    </>
    );
};

export const OrderTaco = () => {

    const { actions } = useContext(Context);

    const [order, setOrder] = React.useState({
        tortilla: "",
        proteins: [],
        veggie: [],
        cheese: [],
        salsa: [],
    });

    const [tortillas, setTortillas] = React.useState([]);
    const [proteinas, setProteinas] = React.useState([]);
    const [veggies, setVeggies] = React.useState([]);
    const [quesos, setQuesos] = React.useState([]);
    const [salsas, setSalsas] = React.useState([]);

    const getProteins = () => {
        fetch(process.env.BACKEND_URL + "/api/proteins")
            .then((response) => response.json())
            .then((data) => {
                setProteinas(data);
            });
    };

    const getVeggies = () => {
        fetch(process.env.BACKEND_URL + "/api/vegetables")
            .then((response) => response.json())
            .then((data) => {
                setVeggies(data);
            });
    }

    const getQuesos = () => {
        fetch(process.env.BACKEND_URL + "/api/cheeses")
            .then((response) => response.json())
            .then((data) => {
                setQuesos(data);
            });
    }

    const getSalsas = () => {
        fetch(process.env.BACKEND_URL + "/api/sauces")
            .then((response) => response.json())
            .then((data) => {
                setSalsas(data);
            });
    }

    const getTortillas = () => {
        fetch(process.env.BACKEND_URL + "/api/tortillas")
            .then((response) => response.json())
            .then((data) => {
                setTortillas(data);
            });
    }

    React.useEffect(() => {
        getProteins();
        getVeggies();
        getQuesos();
        getSalsas();
        getTortillas();
    }, []);


    const onSelectedKey = (checked, key, value) => {
        if (checked) {
            setOrder({
                ...order,
                [key]: [...order[key], value],
            });
        } else {
            setOrder({
                ...order,
                [key]: order[key].filter((item) => item != value),
            });
        }
    };

    return (
        <div className="container mx-auto">
            <div className="row mx-auto col-6">
                <div className="mt-4 mx-auto">
                    <h1>Order Taco</h1>
                </div>
                <div className="col-12 mt-4 bg-dark text-white
                    d-flex flex-column justify-content-center align-items-start p-2
                ">
                    <h1 className="fw-normal fs-5 m-0 p-0">Tortillas</h1>
                </div>
                {
                    tortillas.map((tortilla, index) =>
                        <IngredientRadius key={index} {...tortilla}
                            type={"tortilla"}
                            tortillaValue={order.tortilla}
                            tortillaId={tortilla.id}
                            onUnChecked={() => {
                                setOrder({
                                    ...order,
                                    tortilla: tortilla.id,
                                });
                            }}
                        />
                    )
                }
                <div className="col-12 mt-4 bg-dark text-white
                    d-flex flex-column justify-content-center align-items-start p-2
                ">
                    <h1 className="fw-normal fs-5 m-0 p-0">Proteinas</h1>
                </div>
                {
                    proteinas.map((protein, index) =>
                        <IngredientOption key={index} {...protein}
                            onSelect={(checked) => onSelectedKey(checked, 'proteins', protein.id)}
                        />
                    )
                }

                <div className="col-12 mt-4 bg-dark text-white
                    d-flex flex-column justify-content-center align-items-start p-2
                ">
                    <h1 className="fw-normal fs-5 m-0 p-0">Vegetales</h1>
                </div>
                {
                    veggies.map((vege, index) =>
                        <IngredientOption key={index} {...vege}
                            onSelect={(checked) => onSelectedKey(checked, 'veggie', vege.id)}
                        />
                    )
                }
                <div className="col-12 mt-4 bg-dark text-white
                    d-flex flex-column justify-content-center align-items-start p-2
                ">
                    <h1 className="fw-normal fs-5 m-0 p-0">Quesos</h1>
                </div>
                {
                    quesos.map((cheese, index) =>
                        <IngredientOption key={index} {...cheese}
                            onSelect={(checked) => onSelectedKey(checked, 'cheese', cheese.id)}
                        />
                    )
                }
                <div className="col-12 mt-4 bg-dark text-white
                    d-flex flex-column justify-content-center align-items-start p-2
                ">
                    <h1 className="fw-normal fs-5 m-0 p-0">Salsas</h1>
                </div>
                {
                    salsas.map((sals, index) =>
                        <IngredientOption key={index} {...sals}
                            onSelect={(checked) => onSelectedKey(checked, 'salsa', sals.id)}
                        />
                    )
                }
                <div className="d-flex justify-content-center">
                    <button className="btn btn-danger mx-2"
                        onClick={() => {
                            setOrder({
                                tortilla: "",
                                proteins: [],
                                veggie: [],
                                cheese: [],
                                salsa: [],
                            });
                            toast.success("Order canceled");
                        }}
                    >Cancel</button>
                    <button className="btn btn-success mx-2"
                        onClick={() => {
                            actions.newOrder(order);
                        }}
                    >
                        Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderTaco;