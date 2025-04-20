# Use an official Python runtime as a parent image
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose the port Flask runs on
EXPOSE 8080

# Run the application
CMD ["watchmedo", "auto-restart", "--patterns=*.py;*.html;*.css;*.js", "--recursive", "--", "python", "app.py"]
