FROM node:14 AS build-stage

WORKDIR /react-app
COPY react-app/. .

# You have to set this because it should be set during build time.
ENV REACT_APP_BASE_URL=http://unicord.onrender.com/

# Build our React App
RUN npm install
RUN npm run build

FROM python:3.9

# Setup Flask environment
ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=True
# ENV SECRET_KEY=GKYY87GFHJJN

EXPOSE 8000

WORKDIR /var/www
COPY . .
COPY --from=build-stage /react-app/build app/static/

# Install Python Dependencies
RUN pip install -r requirements.txt
RUN pip install psycopg2

# Run flask environment
CMD gunicorn --worker-class eventlet -b :8000 -w 4 --timeout=250 app:app
# CMD gunicorn --worker-class eventlet -w 1 --timeout=250 --log-level=debug app:app
