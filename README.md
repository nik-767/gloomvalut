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

## Database Models

Gloomvalut's relational database contains the following key models:

1. **Destination**: Represents a castle or place of interest.
   - `posted_by`: ForeignKey to the `User` who posted it (set to null if the user is deleted).
   - `castle`: Unique CharField representing the castle's name.
   - `country`: CharField for the castle's location country.
   - `description`: Detailed text description.
   - `image`: Image upload location under `images/`.
   - `atmosphere`: FloatField representing user atmosphere rating.
   - `tags`: ManyToMany relationship to `Tag`.

2. **Review**: Represents a user review for a destination.
   - `comment`: Text comment.
   - `rating`: Integer rating.
   - `user`: ForeignKey to the reviewer (`User`).
   - `destination`: ForeignKey to the rated `Destination`.

3. **Tag**: Tags associated with different castles (e.g., historical, scenic).
   - `name`: CharField for the tag's name.

4. **Profile**: Extension of the default Django `User` model.
   - `user`: OneToOneField linked to Django `User`.
   - `bio`: Short user biography.
   - `pic`: Profile picture.
   - `created`: Date and time of profile creation.

5. **Follow**: Manages user relationships.
   - `followers`: ForeignKey pointing to the user who is following.
   - `following`: ForeignKey pointing to the user being followed.

## Views & API Endpoints

Gloomvalut includes both interactive HTML templates (web views) and REST API endpoints.


### Web Views
- `/` or `/home`: Home page featuring castle destinations, rating displays, castle additions, and paginated searches.
- `/register`: User registration form.
- `/login`: User authentication view.
- `/review/<destination_id>`: Review/rating dashboard for a specific destination.
- `/update-review/<id>`: Edit/update your published reviews.
- `/delete-review/<id>`: Delete reviews.
- `/update-castle/<id>` & `/delete-castle/<id>`: Update and delete destination postings.
- `/profile` & `/profile/update`: View and edit personal profiles.
- `/follow/<user_id>`: Quick follow/unfollow toggle.
- `/profile/<user_id>`: Public user profile page displaying statistics (follower/following count) and posts.
- `/feed`: Activity feed displaying recent posts from followed users.


### REST API Endpoints
All API endpoints require JWT authorization tokens (except `/api/register/`).

- **Authentication**:
  - `POST /api/register/`: Registers a user and returns a access/refresh token pair.

- **Destinations & Reviews**:
  - `GET | POST | PUT | DELETE /api/gloomvalut/`: CRUD endpoints for castles.
  - `GET | POST | PUT | DELETE /api/review/`: CRUD endpoints for reviews.
  - `GET | POST /api/review-destination/<destination_id>/`: Retrieves or posts reviews for a specific destination.

- **Social & Profiles**:
  - `GET | POST /api/follow/<user_id>/`: Lists follow links or follows/unfollows a user.
  - `GET /api/feed/`: Customized feed of followed users.
  - `GET /api/profile-details/<user_id>/`: User profile details, posts, and follow stats.

## Project Structure

```text
gloomvalut/
│
├── core/                   # Main Django app containing core logic
│   ├── migrations/         # Database migrations
│   ├── admin.py            # Django Admin registration
│   ├── apps.py             # App Configuration
│   ├── models.py           # Database Models
│   ├── serializer.py       # REST Framework Serializers
│   ├── tests.py            # Unit tests
│   └── views.py            # Application Views & REST API View classes
│
├── gloomvalut/             # Project-level configuration directory
│   ├── settings.py         # Django settings file
│   ├── urls.py             # URL routing rules
│   └── wsgi.py / asgi.py   # Gateway interface configs
│
├── media/                  # Location for user-uploaded castle & profile pictures
├── static/                 # Static CSS, JS, and image files
├── templates/              # HTML layout templates
├── manage.py               # Django execution script
├── requirements.txt        # Project package dependencies
└── db.sqlite3              # Local SQLite database
```
