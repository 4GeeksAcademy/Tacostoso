"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Order, Tortilla, Protein, Sauce, Cheese, Vegetable
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import bcrypt

import os

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender_email = os.getenv("SMTP_USERNAME")
sender_password = os.getenv("SMTP_PASSWORD")
smtp_host = os.getenv("SMTP_HOST")
smtp_port = os.getenv("SMTP_PORT")
reciever_email = os.getenv("RECIEVERS_EMAIL")


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/send-email', methods=['POST'])
def send_email():

    message = MIMEMultipart("alternative")
    message["Subject"] = "Tacos App - Order Confirmation"
    message["From"] = sender_email
    recipients = ["cdalzate91@gmail.com", "mrguidoc@gmail.com",
                    "kevtorricov@gmail.com",
                      "adrianaisea99@gmail.com", "alexriascos159@gmail.com", 
                      "yshungria@unal.edu.co", "cesarrrr2003@gmail.com"
                    ]
    
    message["To"] = ", ".join(recipients)

    text = "Your order has been confirmed!"

    html_content = """
        <html>
            <body>
                <h1 style="color:green;">Your Tacos will arrive Soon 🌮!</h1>
                <p>This email is sent using <b>Tacostoso Backend</b> and Gmail's SMTP server.</p>
            </body>
        </html>
    """

    part1 = MIMEText(text, "plain")

    part2 = MIMEText(html_content, "html")

    message.attach(part1)

    message.attach(part2)

    smtp_connection = smtplib.SMTP(smtp_host, smtp_port)

    smtp_connection.starttls() # Secure the connection

    smtp_connection.login(sender_email, sender_password)

    smtp_connection.sendmail(sender_email, recipients, message.as_string())

    smtp_connection.quit()

    return jsonify({"msg": "Email sent"}), 200

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if email == None or password == None:
        return jsonify({"msg": "Missing keys email or password."}), 401

    user = User.query.filter_by(email=email).first()

    if user == None:
        return jsonify({"msg": "User not found!"}), 404
    
    password_bytes = bytes(password, 'utf-8')

    if bcrypt.checkpw(password_bytes, user.password.encode('utf-8')):

        access_token = create_access_token(identity=email)

        return jsonify({
            "token": access_token,
            "user": user.serialize() 
        }), 200
    
    return jsonify({"msg": "Invalid password"}), 401

@api.route("/register", methods=["POST"])
def register():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    full_name = request.json.get("full_name", None)
    profile_image = request.json.get("profile_image_url", None)

    if email == None or password == None:
        return jsonify({"msg": "Missing keys email or password."}), 401

    user = User.query.filter_by(email=email).first()

    if user != None:
        return jsonify({"msg": "User already exists!"}), 401

    bpassword = bytes(password, 'utf-8')

    salt = bcrypt.gensalt(14)

    hashed_password = bcrypt.hashpw(password=bpassword, salt=salt)

    print( hashed_password.decode('utf-8') )

    new_user = User(email=email, password=hashed_password.decode('utf-8'), salt=salt, full_name=full_name, phone=None, address=None, profile_image_url=profile_image)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({ "user": new_user.serialize(),
            "token": create_access_token(identity=email)            
        }), 200


@api.route("/user", methods=["GET"])
@jwt_required()
def get_user_logged():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    return jsonify(user.serialize()), 200

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

@api.route('/order', methods=['POST'])
def create_order():
    request_body = request.get_json()


    new_order = Order(
        status=request_body["status"],
        order_datetime=datetime.now(),
        user=User.query.get(request_body["user_id"]),
        tortilla=Tortilla.query.get(request_body["tortilla_id"]),
        proteins=[Protein.query.get(protein_id) for protein_id in request_body["proteins"]],
        sauces=[Sauce.query.get(sauce_id) for sauce_id in request_body["sauces"]],
        cheeses=[Cheese.query.get(cheese_id) for cheese_id in request_body["cheeses"]],
        vegetables=[Vegetable.query.get(vegetable_id) for vegetable_id in request_body["vegetables"]]
    )

    db.session.add(new_order)
    db.session.commit()
    return jsonify(new_order.simple_serialize()), 200