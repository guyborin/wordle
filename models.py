# from flask_sqlalchemy import SQLAlchemy
# from flask import Flask, request, jsonify
# app = Flask(__name__)
# db = SQLAlchemy(app)

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(50), nullable=False)

class Money():
    def __init__(self):
        self.amount = 500