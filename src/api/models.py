from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    street = db.Column(db.String(120), unique=False, nullable=False)
    number = db.Column(db.String(80), unique=False, nullable=False)
    city = db.Column(db.String(80), unique=False, nullable=False)
    state = db.Column(db.String(80), unique=False, nullable=False)
    zip_code = db.Column(db.String(80), unique=False, nullable=False)
    def __repr__(self):
        return f'<Address {self.street}>'

    def serialize(self):
        return {
            "id": self.id,
            "street": self.street,
            "number": self.number,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    phone = db.Column(db.String(80), unique=False, nullable=True)

    address_id = db.Column(db.Integer, db.ForeignKey('address.id'), nullable=True)
    address = db.relationship('Address', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "phone": self.phone,
            "address": self.address.serialize() if self.address else None
            # do not serialize the password, its a security breach
        }
    
class Tortilla(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    price = db.Column(db.Float(), unique=False, nullable=False)
    is_gmo = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Tortilla {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "is_gmo": self.is_gmo
        }

class Protein(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    price = db.Column(db.Float(), unique=False, nullable=False)
    is_vegan = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Protein {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "is_vegan": self.is_vegan,
            "orders": [order.simple_serialize() for order in self.order]
        }

class Vegetable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    price = db.Column(db.Float(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Vegetable {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
        }

class Sauce(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    price = db.Column(db.Float(), unique=False, nullable=False)
    is_spicy = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Salsa {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "is_spicy": self.is_spicy
        }

class Cheese(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    price = db.Column(db.Float(), unique=False, nullable=False)
    is_vegan = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Cheese {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "is_vegan": self.is_vegan
        }
    
protein_association = db.Table('protein_association',
    db.Column('order_id', db.Integer, db.ForeignKey('order.id')),
    db.Column('protein_id', db.Integer, db.ForeignKey('protein.id'))
)

sauce_association = db.Table('sauce_association',
    db.Column('order_id', db.Integer, db.ForeignKey('order.id')),
    db.Column('sauce_id', db.Integer, db.ForeignKey('sauce.id'))
)

queso_association = db.Table('queso_association',
    db.Column('order_id', db.Integer, db.ForeignKey('order.id')),
    db.Column('cheese_id', db.Integer, db.ForeignKey('cheese.id'))
)

vegetable_association = db.Table('vegetable_association',
    db.Column('order_id', db.Integer, db.ForeignKey('order.id')),
    db.Column('vegetable_id', db.Integer, db.ForeignKey('vegetable.id'))
)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(120), unique=False, nullable=False)
    # total = db.Column(db.Float(), unique=False, nullable=False)
    order_datetime = db.Column(db.DateTime, unique=False, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref='order', lazy=True)

    tortilla_id = db.Column(db.Integer, db.ForeignKey('tortilla.id'), nullable=False)
    tortilla = db.relationship('Tortilla', backref='order', lazy=True)

    proteins = db.relationship('Protein', secondary=protein_association, backref='order', lazy=True)
    sauces = db.relationship('Sauce', secondary=sauce_association, backref='order', lazy=True)
    cheeses = db.relationship('Cheese', secondary=queso_association, backref='order', lazy=True)
    vegetables = db.relationship('Vegetable', secondary=vegetable_association, backref='order', lazy=True)


    def __init__(self, status, order_datetime, user, tortilla, vegetables, proteins, sauces, cheeses):
        self.status = status
        self.order_datetime = order_datetime
        
        self.user = user
        self.tortilla = tortilla

        self.proteins = proteins
        self.sauces = sauces
        self.cheeses = cheeses
        self.vegetables = vegetables

    def __repr__(self):
        return f'<Order {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "status": self.status,
            "order_datetime": self.order_datetime,
            "tortilla": self.tortilla.serialize(),
            "proteins": [protein.serialize() for protein in self.proteins],
            # "total": self.total,
            "sauces": [sauce.serialize() for sauce in self.sauces],
            "cheeses": [cheese.serialize() for cheese in self.cheeses],
            "vegetables": [vegetable.serialize() for vegetable in self.vegetables],
            
            "total": sum([protein.price for protein in self.proteins]) +
            sum([sauce.price for sauce in self.sauces]) +
            sum([cheese.price for cheese in self.cheeses]) +
            sum([vegetable.price for vegetable in self.vegetables])
             + self.tortilla.price,
            "user": self.user.serialize()
        }

    def simple_serialize(self):
        return {
            "id": self.id,
            "status": self.status,
            "order_datetime": self.order_datetime,
            "total": sum([protein.price for protein in self.proteins]) +
            sum([sauce.price for sauce in self.sauces]) +
            sum([cheese.price for cheese in self.cheeses]) +
            sum([vegetable.price for vegetable in self.vegetables])
             + self.tortilla.price,
            
            "user": self.user.serialize()
        }