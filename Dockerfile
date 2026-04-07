FROM python:3.9.18-alpine3.18

RUN apk add build-base

RUN apk add postgresql-dev gcc python3-dev musl-dev

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY
ARG API_KEY
ARG S3_BUCKET
ARG S3_KEY
ARG S3_SECRET

WORKDIR /var/www

COPY requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY . .


ENV FLASK_APP=app

# Migrations need DATABASE_URL at runtime (Render injects it), not at image build.
# Run `flask seed all` once from Render Shell if you need seeded data (not every start).

CMD ["sh", "-c", "flask db upgrade && exec gunicorn --bind 0.0.0.0:${PORT:-5000} app:app"]