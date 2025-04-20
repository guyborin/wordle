from flask import Flask, render_template, request, jsonify
# from flask_cors import CORS  # Import Flask-CORS
from models import Money
import os  # Import os module
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("guy-wordle-firebase-adminsdk-fbsvc-18932c889a.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)

# CORS(app)  # Enable CORS for all routes


@app.route('/add', methods=['POST'])
def add():
    data = request.json
    db.collection('users').add(data)
    return jsonify({"message": "Data added successfully!"})

money = Money()

@app.route('/money', methods=['GET'])
def get_money():
    # users = User.query.all()
    # return jsonify([{'id': user.id, 'name': user.name} for user in users])
    return jsonify({'amount': money.amount})

@app.route('/money', methods=['PUT'])
def update_money():
    data = request.json
    new_amount = data.get('new_amount')
    if new_amount is None:
        return jsonify({'error': 'Amount not provided'}), 400

    money.amount = new_amount
    # Here you'd normally update the money in a database or global variable
    return jsonify({'message': f'Money updated to {new_amount}'}), 200


@app.route("/")
def home():
    return render_template("wordChase.html")
    #return jsonify({"message": "Hello, Cloud Run!"})

@app.route("/add-data", methods=["POST"])
def add_data():
    data = request.json
    doc_ref = db.collection("items").document()
    doc_ref.set(data)
    return jsonify({"message": "Data added!", "id": doc_ref.id})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

