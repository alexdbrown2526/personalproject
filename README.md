<h1> Podcast Web Application</h1>
A web application that I built to grow my AngularJS knowledge(Still in Progress)

The steps for cloning the app are as follows:

1. Run<code> git clone </code> in terminal to clone the repo.

2. Run<code> npm install </code>to install all of the dependencies.

3. The app runs side by side with Mongo DB so in a seperate terminal run<code> mongod </code>.

4. Now we are ready to start up so run<code> npm start </code>.

The site is hosted locally on <code>localhost:3000</code>.

The homepage will display the current top 50 podcasts in the charts.

Under Discover you can search by subcategories to find podcasts that interest you.

You can also search by keyword in the search bar.

**If your heart so desires (NOT required for the app to function)**

The login is not currently functional as authentication needs to be completed but the route is currently available and working. If you would like to use the playlist functionality you must sent a post via postman to <code>localhost:3000/users</code>

The model you need to follow for the body elements is: 
<code>firstName, lastName, email, username, password</code>

Then you need to go into robomongo and copy the guid. Once its been copied it needs to be pasted into the **app.js** on **lines 104 and 206** and also in the **playlist.js** under the routes on **line 9**.


<h1>TODOS:</h1>
1. Fix search bar bug(only allows one search wont fire again unless you leave the results page.)
2. Complete authentication to allow users the option to login and add to their own personal playlist.
3. Add download functionality so users can download to computer.
4. Build a more visually pleasing media player.
5. Make a catch all to redirect on any /* entries in the url so you dont get a 404.
