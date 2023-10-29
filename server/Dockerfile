FROM python:3.9-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client
# COPY executes on the HOST! Rest of the commands executes on the CONTAINER!
COPY requirements.txt /app
RUN pip install --no-cache-dir -r /app/requirements.txt
RUN pip install gunicorn
COPY . /app
RUN python manage.py collectstatic --noinput
EXPOSE 5000