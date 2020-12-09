FROM python:3.8

# Assuming Ubuntu distro, install python3-django in container
RUN apt-get update \
        && apt-get install -y --no-install-recommends \
            python3-django \
        && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app/backend/

# Copy requirements stored in text file, then install it into the
# container
COPY requirements.txt /app/backend/
RUN pip3 install -r requirements.txt

# Copy all installed files into app directory
COPY . .

# Deploy Django backend (need to adjust security when deployed)
# by binding to port 8000
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
