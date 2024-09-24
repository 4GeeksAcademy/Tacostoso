"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Order, Tortilla, Protein, Sauce, Cheese, Vegetable
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/tortillas', methods=['GET'])
def get_tortillas():
    tortillas = Tortilla.query.all()
    return jsonify([ tortilla.serialize() for tortilla in tortillas ]), 200


@api.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([ order.serialize() for order in orders ]), 200

@api.route('/proteins', methods=['GET'])
def get_proteins():
    proteins = Protein.query.all()
    return jsonify([ protein.serialize() for protein in proteins ]), 200

@api.route('/sauces', methods=['GET'])
def get_sauces():
    sauces = Sauce.query.all()
    return jsonify([ sauce.serialize() for sauce in sauces ]), 200

@api.route('/cheeses', methods=['GET'])
def get_cheeses():
    cheeses = Cheese.query.all()
    return jsonify([ cheese.serialize() for cheese in cheeses ]), 200

@api.route('/vegetables', methods=['GET'])
def get_vegetables():
    vegetables = Vegetable.query.all()
    return jsonify([ vegetable.serialize() for vegetable in vegetables ]), 200