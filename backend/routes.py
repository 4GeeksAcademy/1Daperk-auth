"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from backend.models import db, User
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token, current_user, jwt_required, get_jwt_identity
)

api = Blueprint('api', __name__, url_prefix="/api")

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

#### SIGN UP
#[POST] /users Create users. 
@api.route("/user", methods=["POST"])
def create_user():
    # Extract data from request
    data = request.get_json()  # Ensure data is JSON
    if not data:
        return jsonify({"message": "Invalid input"}), 400

    # Verifying we are receiving all required data in the request
    email = data.get("email")
    password = data.get("password")

    # Returning 400 if data is not correct
    if not email or not password:
        return jsonify({"message": "Email and Password are Required"}), 400
    
    # Email Verification
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Invalid email"}), 400
    
    # We create new user
    new_user = User(email=email, password=password, is_active=True)
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({"message": "Error in server"}), 500
    return jsonify({"message": "User created successfully"}), 201

## LOGIN
# token
@api.route("/token", methods=["POST"])
def login_user():
    try:
        data = request.get_json()
        if not data:
            app.logger.error("No data received in request")
            return jsonify({"message": "Invalid input"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            app.logger.error("Email or Password not provided")
            return jsonify({"message": "Email and Password are Required"}), 400

        user = User.query.filter_by(email=email).first()
        if user is None or user.password != password:
            app.logger.error("Invalid email or password")
            return jsonify({"message": "Email or password invalid"}), 400

        token = create_access_token(identity=user)
        response_body = {
            "token": token,
            "user": user.serialize()
        }
        return jsonify(response_body), 201

    except Exception as e:
        app.logger.error(f"Error during login: {e}")
        return jsonify({"message": "Internal server error"}), 500



## PERSONAL PRIVATE VIEW --- USERS only can see theirs info
#[GET] /user/id Get user ig
@api.route("/user/id", methods=['GET'])
@jwt_required()
def get_user_ig():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 400
    return jsonify(
        {
            "user": {
                "email": user.email,
                "password": user.password,
                #"private_info": user.private_info,
                "is_active": user.is_active
            }
        }
    ), 200
