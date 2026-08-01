# ── Stage 1: Build the React frontend ──
FROM node:20-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# ── Stage 2: Django backend + compiled frontend ──
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app

# Copy Vite build output into Django's static directory
COPY --from=frontend-build /frontend/dist /app/frontend/dist

EXPOSE 8000

CMD sh -c "python manage.py collectstatic --noinput && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
