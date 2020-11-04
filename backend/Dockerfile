FROM python:3.8

RUN apt-get update \
        && apt-get install -y --no-install-recommends \
            python3-django \
        && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend
COPY requirements.txt /app/backend
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
