FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
# COPY executes on the HOST! Rest of the commands executes on the CONTAINER!
COPY requirements.txt /app
RUN pip install -r /app/requirements.txt
COPY . /app