FROM python:3.9-slim

WORKDIR /var/www

RUN apt-get update && apt-get install -y gcc libpq-dev

COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install psycopg2==2.9.10

COPY . .

CMD flask db upgrade && flask seed all && gunicorn app:app

# RUN flask db upgrade
# RUN flask seed all
# CMD gunicorn app:app
