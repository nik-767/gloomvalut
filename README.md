# Gloomvalut

Gloomvalut is a Django-based social platform for castle lovers. Users can discover destinations, leave reviews, follow other users, and browse a personalized feed of posts from the people they follow.

## Features

- Castle destination posts with names, countries, descriptions, images, and atmosphere ratings
- Review and rating system for each destination
- User profiles with bios, profile pictures, and social stats
- Follow and unfollow functionality
- Personalized activity feed
- REST API support with JWT authentication

## Tech Stack

- Python
- Django
- Django REST Framework
- SQLite for local development

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nik-767/gloomvalut.git
cd gloomvalut
```

### 2. Create and activate a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Apply database migrations

```bash
python manage.py migrate
```

### 5. Run the development server

```bash
python manage.py runserver
```

Open http://127.0.0.1:8000/ in your browser.

## API Overview

- POST /api/register/
- GET | POST | PUT | DELETE /api/gloomvalut/
- GET | POST | PUT | DELETE /api/review/
- GET | POST /api/review-destination/<destination_id>/
- GET | POST /api/follow/<user_id>/
- GET /api/feed/
- GET /api/profile-details/<user_id>/

## Project Structure

```text
gloomvalut/
├── core/                 # Main Django app
├── gloomvalut/           # Project settings and URLs
├── media/                # Uploaded images
├── static/               # Static files
├── templates/            # HTML templates
├── manage.py             # Django management script
├── requirements.txt      # Project dependencies
└── db.sqlite3            # Local database
```

## Author

Nikhil Kalra
