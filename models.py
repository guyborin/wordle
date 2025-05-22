import firebase_admin
from firebase_admin import credentials, firestore
# from app import log_inSuccess, log_inError

cred = credentials.Certificate("guy-wordle-firebase-adminsdk-fbsvc-18932c889a.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

defaultUser = dict(
    experience_points=1000, 
    coins=9999, 
    hint_keyboard_letter=0,
    hint_column_letter=0,
    hint_chance=0,
    restart_counter=2
)


def addUser(email, username, password):
    print("addUser: ", email, username, password)
    
    users_ref = db.collection('users')
    query = users_ref.where("name", "==", username)
    query2 = users_ref.where("email", "==", email)
    if any(query.stream()):
        return "User already taken"
    if any(query2.stream()):
        return "Account with this email already exists"
    user_data = defaultUser.copy()
    user_data["email"] = email
    user_data["name"] = username
    user_data["password"] = password
    try:
        print("addUser3", user_data)
        doc_ref = users_ref.add(user_data)
        return "User created successfully!"
    except Exception as e:
        print("Error adding record:", e)

def getUser(emailname, password):
    try:
        print("getUser: ", emailname, password)
        users_ref = db.collection("users")
        print("users_ref: ", users_ref)

        query1 = users_ref.where("name", "==", emailname)
        query2 = users_ref.where("email", "==", emailname)
        #.where("email", "==", emailname)
        print("query: ", query1.stream())
        for user in query1.stream():
            print(f"User found by name: {user.id} => {user.to_dict()}")
            if user.to_dict()["password"] == password:
                print("User found by password: ", user.id, user.to_dict())
                return user.to_dict()
            else:
                return "Incorrect password"
        for user in query2.stream():
            print(f"User found by email: {user.id} => {user.to_dict()}")
            if user.to_dict()["password"] == password:
                print("User found by password: ", user.id, user.to_dict())
                return user.to_dict()
            else:
                return "Incorrect password"
        return "User or email not found"
    except Exception as e:
        print("Error adding record:", e)

def updateUser(username, experience_points, coins, hint_keyboard_letter, hint_column_letter, hint_chance, restart_counter):
    users_ref = db.collection("users")
    query = users_ref.where("name", "==", username)
    print("query: ", query.stream())
    for doc in query.stream():
        doc_ref = db.collection("users").document(doc.id)
        doc_ref.update({
            "experience_points": experience_points,
            "coins": coins,
            "hint_keyboard_letter": hint_keyboard_letter,
            "hint_column_letter": hint_column_letter,
            "hint_chance": hint_chance,
            "restart_counter": restart_counter
        })
    print(f"User {username} updated successfully.", query)
    return "User updated successfully!"