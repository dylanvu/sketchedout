# SketchedOut

This was our submission to the SacHacks III hackathon. Our devpost is here: https://devpost.com/software/sketchedout

You can find the most recent working version on Heroku: https://sketchedout.herokuapp.com/

The backend server code in this respository is not in use on Heroku and is not up to date. Please see my other respository, [sketchedout-server](https://github.com/vu-dylan/sketchedout-server), for the most recent working NodeJS Express server.

## Known Issues
* When a user joins a room that already has a drawing on it, they will not be able to receive the current whiteboard. We are working on debugging this issue.
* It takes a while to launch the website if no one is using it. This is because Heroku has to launch the backend server.
* If too many users draw at once, the app dramatically slows down.
