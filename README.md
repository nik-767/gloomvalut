# Gloomvalut

Gloomvalut is a Django-based social and exploration platform for castle enthusiasts. Users can share information about castles (destinations), rate and review them, follow other users, and view a customized feed of posts from the users they follow.

## Features

- **Castle Destinations**: Share castles with names, countries, descriptions, images, and atmosphere ratings.
- **Reviews & Ratings**: Rate castles and write descriptive reviews.
- **User Profiles**: Custom profiles displaying bios, profile pictures, user posts, and social statistics.
- **Following System**: Follow and unfollow other users to customize your feed.
- **Activity Feed**: A personalized feed featuring recent posts from users you follow.
- **REST APIs**: Full API support with JWT (JSON Web Token) authentication for registrations, profiles, reviews, following, and feeds.

## Getting Started

Follow these steps to run the Gloomvalut project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/nik-767/gloomvalut.git
cd gloomvalut
```

### 2. Set Up a Virtual Environment
Create and activate a Python virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
Install all required Python packages:
```bash
pip install -r requirements.txt
```

### 4. Run Migrations
Run Django migrations to set up the local SQLite database:
```bash
python manage.py migrate
```

### 5. Run the Server
Start the development server:
```bash
python manage.py runserver
```
Visit the application in your browser at `http://127.0.0.1:8000/`.

