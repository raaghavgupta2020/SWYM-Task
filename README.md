# SWYM-Task

# Live Event Question Capture System

## Objective
Design and implement a system that captures questions from participants for a live event. The system should generate a unique URL for each event where participants can submit their questions. As a bonus, the event URL should have a specific time to live (TTL) after which it expires.

## Requirements
1. **Event Creation**: There should be an interface for creating a new event, which should include details like event name, description, date, time, and TTL (optional).
2. **Unique URL Generation**: Upon creation of an event, a unique URL should be generated where participants can submit their questions. This URL should be easily shareable.
3. **Question Submission Interface**: The unique URL should lead to an interface where participants can submit their questions for the event.
4. **TTL for URL (Bonus)**: If implemented, after the specified TTL, the URL should expire. This means it will no longer accept new questions.

### Technologies Used
- Front-end: HTML, CSS, JavaScript
- Back-end: Node.js, Express.js, MongoDB

### Files
1. **index.html**: HTML file containing the user interface for the Live Event Question Capture System.
2. **styles.css**: CSS file for styling the user interface.
3. **script.js**: JavaScript file handling the dynamic behavior of the web application.
4. **server.js**: Node.js server file implementing the back-end logic and API endpoints.
5. **package.json**: Contains the project's dependencies and other metadata.

### Steps to run the code - 
1. **Install node modules using "npm i"**
2. **Type "node server.js" to run the application**
3. **Application will start at http://localhost:3000/**

### How to Use
1. Open `index.html` in your web browser.
2. As a host, log in using the provided credentials (username: "raghav", password: "raghav123").
3. Fill in the details to create a new event (event name, description, date, time, and TTL if desired).
4. Upon event creation, a unique URL will be generated for the event. Share this URL with participants.
5. Participants can use the unique event URL to submit their questions for the event.
6. If a TTL was set for the event, the URL will expire after the specified time, and no new questions can be submitted, otherwise the event will never expire.

Feel free to contribute to the project and improve its features!
