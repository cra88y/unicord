# Unicord

[Unicord](https://unicord.herokuapp.com/ "Live site hosted on Heroku") is website built to clone the functionality of [Discord](https://discord.com/ "Discord"). It is a one page chat app where you can create an account, then chat in servers created by the site's users. It features live chat rooms with the ability to update and delete your messages in real time.

This project is hosted on Heroku and the live site with a demo is viewable at [UNiCORD](https://unicord.herokuapp.com/ "Live site hosted on Heroku").

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
![image](https://user-images.githubusercontent.com/22042885/156049091-21f19242-db69-43a6-9719-45f4679382c8.png)
![image](https://user-images.githubusercontent.com/22042885/156048787-16189b98-e61b-49a6-9b97-5915d0edae4a.png)
![image](https://user-images.githubusercontent.com/22042885/156049266-c2682d4a-8a1a-466e-a56f-c96ff9df5ddc.png)
![image](https://user-images.githubusercontent.com/22042885/156048827-90436a55-3c88-44da-8828-0f1cb4c30a2b.png)
![image](https://user-images.githubusercontent.com/22042885/156048561-90f1869c-d4be-4911-b22c-fd246b033154.png)

# Setup Instructions To Run

1. Clone this repo
2. In the root directory run the command `pipenv install`
3. In the `/react-app` directory of the cloned repo, run `npm install` to install node dependencies
4. Create a PostgreSQL database and user for the app
5. Rename `/.env.EXAMPLE` to ".env", and fill out the values using the PostgreSQL information you just created
7. Run database migrations with the command `pipenv run flask db migrate`
8. Run the Flask backend server with the command `pipenv run flask run` in the root directory
9. In a new terminal, run `npm start` in the /react-app directory
