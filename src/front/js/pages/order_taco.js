import React from "react";

const IngredientRadius = ({ name, price, tortillaValue, onUnChecked }) => {
    return (
        <div className="col-12 my-2">
            <div class="row border-bottom border-dark">
                <div className="col-6 m-0 p-0">
                    <h2 className="fs-4 fw-lighter">{name}</h2>
                </div>
                <div class="form-check col-6 justify-content-end d-flex">
                    <input class="form-check-input form-check-input-checked-bg-success"
                        type="checkbox" checked={tortillaValue == name} id={"tortilla-" + name}
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
            <div class="row border-bottom border-dark">
                <div className="col-6 m-0 p-0">
                    <h2 className="fs-4 fw-lighter">{name}</h2>
                </div>
                <div class="form-check col-6 justify-content-end d-flex">
                    <input class="form-check-input form-check-input-checked-bg-success" type="checkbox" value={name} id={name}
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

    const [order, setOrder] = React.useState({
        tortilla: "",
        proteins: [],
        veggie: [],
        cheese: [],
        salsa: [],
    });

    const tortillas = [
        { name: "Corn | Soft", price: 0 },
        { name: "Corn | Hard", price: 0 },
        { name: "Bombshell", price: 1 },
        { name: "Cheese", price: 1 },
    ];

    const proteinas = [
        { name: "Beef", price: 0 },
        { name: "Chicken", price: 0 },
        { name: "Pork", price: 0 },
        { name: "Fish", price: 0 },
        { name: "Shrimp", price: 0 },
        { name: "Veggie", price: 0 },
    ];

    const veggies = [
        { name: "Lettuce", price: 0 },
        { name: "Tomato", price: 0 },
        { name: "Cheese", price: 0 },
        { name: "Guacamole", price: 0 },
    ];

    const quesos = [
        { name: "Cheddar", price: 0 },
        { name: "Jack", price: 0 },
        { name: "Cotija", price: 0 },
        { name: "Queso Fresco", price: 0 },
        { name: "Queso Blanco", price: 0 },
    ];

    const salsas = [
        { name: "Salsa Roja", price: 0 },
        { name: "Salsa Verde", price: 0 },
        { name: "Pico de Gallo", price: 0 },
        { name: "Salsa de Cilantro", price: 0 },
    ];

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
                            onUnChecked={() => {
                                setOrder({
                                    ...order,
                                    tortilla: tortilla.name,
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
                            onSelect={(checked) => onSelectedKey(checked, 'proteins', protein.name)}
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
                            onSelect={(checked) => onSelectedKey(checked, 'veggie', vege.name)}
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
                            onSelect={(checked) => onSelectedKey(checked, 'cheese', cheese.name)}
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
                            onSelect={(checked) => onSelectedKey(checked, 'salsa', sals.name)}
                        />
                    )
                }
                <div className="d-flex justify-content-center">
                    <button className="btn btn-danger mx-2">Cancel</button>
                    <button className="btn btn-success mx-2"
                        onClick={() => {
                            console.log(order);
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