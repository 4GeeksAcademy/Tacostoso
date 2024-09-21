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
            "is_vegan": self.is_vegan
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
            "total": sum([protein.price for protein in self.proteins]) + self.tortilla.price,
            "user": self.user.serialize()
        }