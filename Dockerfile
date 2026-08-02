# ---------- Stage 1: Build React ----------
FROM node:20-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build


# ---------- Stage 2: Django ----------
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy entire Django project
COPY . .

# Copy React build into Django static directory
COPY --from=frontend-build /frontend/dist ./frontend/dist

EXPOSE 8000

# Run migrations, collect static, and start server
CMD sh -c "python manage.py migrate && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"