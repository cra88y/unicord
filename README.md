# Unicord

[Unicord](https://google.com/ "Live site hosted on Heroku") is website built to clone the functionality of [Discord](https://discord.com/, "Discord"). It is a one page chat app where you can create an account, add friends, be part of private conversations with friends, as well as join open chat servers created by users.

This project is hosted on Heroku and the live site with a demo is viewable at [COMING SOON](https://google.com/ "Live site hosted on Heroku").

# Technologies Used
- Node.js
- React
- Redux
- Flask
- PostgreSQL
- SQLAlchemy
- Alembic
- Flask-SocketIO

# Screenshots
TODO

# Setup Instructions To Run

1. Clone this repo
2. In the root directory run the command `pipenv install`
3. In the `/react-app` directory of the cloned repo, run `npm install` to install node dependencies
4. Create a PostgreSQL database and user for the app
5. Rename `/.env.EXAMPLE` to ".env", and fill out the values using the PostgreSQL information you just created
7. Run database migrations with the command `pipenv run flask db migrate`
8. Run the Flask backend server with the command `pipenv run flask run` in the root directory
9. In a new terminal, run `npm start` in the /react-app directory
10. The site should now be up on localhost:3000!
