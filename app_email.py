from flask_mail import Message


def send_email(mail, to=None, subject=None, body=None):
    if not to:
        return "Recipient email address is required."
    msg = Message(
        subject=subject or "No Subject",
        recipients=[to],
        body=body or "This is a test email from Flask.",
    )
    
    try:
        mail.send(msg)
        return None
    except Exception as e:
        return str(e)