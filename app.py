from flask import Flask, render_template, request, jsonify
# from flask_cors import CORS  # Import Flask-CORS
from models import addUser, getUser, updateUser, verifyUser
import os  # Import os module
from flask_mail import Mail
from app_email import send_email
import random

app = Flask(__name__)

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587  # Use 465 for SSL
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'guy.borin23@gmail.com'
app.config['MAIL_PASSWORD'] = 'rmhq ytzd ocbn fzps'  # Use an App Password
app.config['MAIL_DEFAULT_SENDER'] = 'guy.borin23@gmail.com'

mail = Mail(app)
# CORS(app)  # Enable CORS for all routes
@app.route('/verify', methods=['POST'])
def verify_user():
    data = request.json
    
    user = verifyUser(data["email"], data["name"])
    return jsonify(user)

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
        return jsonify("Missing email, name or password")

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
            data["restart_counter"],
            data["total_games_played"],
            data["total_games_won"]
        )
        return jsonify({"message": "User updated successfully!"})
    except Exception as e:
        print("Update error:", e)
        return jsonify({'error': f"Error updating record: {e}"}), 400
    

@app.route("/send-email", methods=["POST"])
def send_verification_email():
    data = request.json
    print("data:", data)
    code = random.randint(100000, 999999)
    ret = send_email(
        mail=mail,
        to=data["email"],
        subject="WordChaze Verification Email",
        body = (
            f"User {data['name']} created an account in WordChaze with your email\n"
            f"Verification code: {code}\n"
            "Please enter this code in the app to verify your email address and complete the registration process.\n"
            "This code is valid for 10 minutes.\n"
            "Thank you for creating an account in WordChaze!"
        )
    )

    if ret is not None:
        return jsonify({"error": ret}), 500
    else:
        return jsonify({"code": code})
    
@app.route("/send-feedback", methods=["POST"])
def send_feedback():
    data = request.json
    print("data:", data)
    ret = send_email(
        mail=mail,
        to="guy.borin23@gmail.com",
        subject=data["subject"],
        body = (
            f"User ({data['username']}), {data['email']} sent:\n"
            f"{data['text']}\n"
        )
    )

@app.route("/")
def home():
    return render_template("wordChase.html")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

