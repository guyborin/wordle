from flask import Flask, render_template, request, jsonify
# from flask_cors import CORS  # Import Flask-CORS
from models import addUser, getUser, updateUser, verifyUser, getUserPassword, updatePassword, getTopUsers
import os  # Import os module
from flask_mail import Mail
from app_email import send_email
import random
from dotenv import load_dotenv

load_dotenv(".env")  # Load environment variables from .env file

app = Flask(__name__)

app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

# Flask-Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587  # Use 465 for SSL
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

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
            data["score"],
            data["coins"],
            data["hint_keyboard_letter"],
            data["hint_column_letter"],
            data["hint_chance"],
            data["restart_counter"],
            data["total_games_played"],
            data["total_games_won"],
            data["games_won_first_try"],
            data["games_won_second_try"],
            data["games_won_third_try"],
            data["games_won_fourth_try"],
            data["games_won_fifth_try"],
            data["games_won_sixth_try"],
            data["games_won_seventh_try"],
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

@app.route("/send-password-email", methods=["POST"])
def send_password_email():
    data = request.json
    print("data:", data)
    code = random.randint(100000, 999999)
    user = getUserPassword(data["email"])
    if user is None:
        return jsonify({"error": "User not found"}), 404
    ret = send_email(
        mail=mail,
        to=data["email"],
        subject="WordChaze Password Reset",
        body = (
            f"User {user['name']} requested a password reset in WordChaze with your email\n"
            f"Verification code: {code}\n"
            "Please enter this code in the app to reset your password.\n"
            "This code is valid for 10 minutes.\n"
            "Thank you for using WordChaze!"
        )
    )
    if ret is not None:
        return jsonify({"error": ret}), 500
    else:
        return jsonify({"code": code})

@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    print("data:", data)
    
    user = getUserPassword(data["email"])
    if user is None:
        return jsonify({"error": "User not found"}), 404
    
    try:
        updatePassword(data["password"], user["email"])
        return jsonify({"message": "Password reset successfully!"})
    except Exception as e:
        print("Reset password error:", e)
        return jsonify({'error': f"Error resetting password: {e}"}), 400

@app.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    start = request.args.get("start", default=None, type=int)
    userNum = request.args.get("users", default=101, type=int)
    users = getTopUsers(start, userNum)
    return jsonify(users)

@app.route("/")
def home():
    return render_template("wordChase.html")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

