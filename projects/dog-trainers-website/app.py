"""
Dog Trainers Website - Flask Application
A simple website advertising dog training services.
"""

from flask import Flask, render_template, request, flash, redirect, url_for
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Email configuration - set these environment variables in production
MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')
MAIL_RECIPIENT = os.environ.get('MAIL_RECIPIENT', '')


@app.route('/')
def home():
    """Home page with hero section and overview."""
    return render_template('home.html')


@app.route('/about')
def about():
    """About page with trainer information."""
    return render_template('about.html')


@app.route('/services')
def services():
    """Services page listing training offerings."""
    return render_template('services.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page with form submission."""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        message = request.form.get('message', '').strip()

        # Basic validation
        if not name or not email or not message:
            flash('Please fill in all required fields.', 'error')
            return render_template('contact.html', name=name, email=email,
                                   phone=phone, message=message)

        # Attempt to send email if configured
        if MAIL_USERNAME and MAIL_PASSWORD and MAIL_RECIPIENT:
            try:
                send_contact_email(name, email, phone, message)
                flash('Thank you! Your message has been sent. We will get back to you soon.', 'success')
            except Exception as e:
                app.logger.error(f'Failed to send email: {e}')
                flash('Thank you for your message! We will contact you soon.', 'success')
        else:
            # Email not configured - just show success (for demo/development)
            app.logger.info(f'Contact form submission: {name} ({email}) - {message[:50]}...')
            flash('Thank you for your message! We will contact you soon.', 'success')

        return redirect(url_for('contact'))

    return render_template('contact.html')


def send_contact_email(name, email, phone, message):
    """Send contact form submission via email."""
    msg = MIMEMultipart()
    msg['From'] = MAIL_USERNAME
    msg['To'] = MAIL_RECIPIENT
    msg['Subject'] = f'Dog Training Inquiry from {name}'

    body = f"""
New contact form submission:

Name: {name}
Email: {email}
Phone: {phone or 'Not provided'}

Message:
{message}
"""
    msg.attach(MIMEText(body, 'plain'))

    with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as server:
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.send_message(msg)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
