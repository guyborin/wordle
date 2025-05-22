from flask import Flask, render_template, request, jsonify
# from flask_cors import CORS  # Import Flask-CORS
from models import addUser, getUser, updateUser  # Import your models
import os  # Import os module

app = Flask(__name__)

# CORS(app)  # Enable CORS for all routes

@app.route('/user', methods=['POST'])
def sign_up():
    data = request.json
    
    user = addUser(data["email"], data["name"], data["password"])
    return jsonify(user)


@app.route('/user', methods=['GET'])
def log_in():
    emailname = request.args.get("emailname")
    password = request.args.get("password")

    if not emailname or not password:
        return jsonify("Missing email/name or password")

    # print("log_in: ", emailname, password)
    user = getUser(emailname, password)
    return jsonify(user)
    
@app.route('/user', methods=['PUT'])
def update_user():
    print("update_user")
    data = request.json
    try:
        updateUser(
            data["name"],
            data["experience_points"],
            data["coins"],
            data["hint_keyboard_letter"],
            data["hint_column_letter"],
            data["hint_chance"],
            data["restart_counter"]
        )
        return jsonify({"message": "User updated successfully!"})
    except Exception as e:
        print("Update error:", e)
        return jsonify({'error': f"Error updating record: {e}"}), 400
    

@app.route("/")
def home():
    return render_template("wordChase.html")
    #return jsonify({"message": "Hello, Cloud Run!"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

