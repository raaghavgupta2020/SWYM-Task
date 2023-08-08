let login = false;
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/hostLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (data.success) {
            alert('Logged in successfully!');
            login = true;
            document.getElementById('event-creation').style.display = 'block';
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        alert('Error logging in: ' + error.message);
    }
});

// Create Event
document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('event-name').value;
    const description = document.getElementById('event-description').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const ttl = document.getElementById('event-ttl').value;

    try {
        const response = await fetch('/createEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, date, time, ttl })
        });
        const data = await response.json();

        if (data.success) {
            alert('Event created! URL: ' + data.url);
        } else {
            alert('Error creating event: ' + data.message);
        }
    } catch (error) {
        alert('Error creating event: ' + error.message);
    }
});

// Submit Question
document.getElementById('qna-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('event-url').value;
    const content = document.getElementById('question-content').value;

    try {
        const response = await fetch(`/submitQuestion/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        const data = await response.json();
        if (data.success) {
            alert('Question submitted successfully!');
            fetchAndDisplayQuestions(url);
        } else {

            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error submitting question: ' + error.message);
    }
});

// async function fetchAndDisplayQuestions(url) {
//     try {
//         const response = await fetch(`/fetchQuestions/${url}`);
//         const data = await response.json();
//         console.log(data.questions);
//         if (data.success) {
//             const questionsList = document.getElementById('questions-list');
//             questionsList.innerHTML = ''; // Clear the list first
//             data.questions.forEach(question => {
//                 const li = document.createElement('li');
//                 li.innerHTML = `<strong>Question:</strong> ${question.content} <br><strong>Reply:</strong> ${question.reply || 'Not yet replied'}`;
//                 questionsList.appendChild(li);
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching questions:', error);
//     }
// }

async function fetchAndDisplayQuestions(url) {
    try {
        const response = await fetch(`/fetchQuestions/${url}`);
        const data = await response.json();

        if (data.success) {
            const questionsList = document.getElementById('questions-list');
            questionsList.innerHTML = ''; // Clear the list first
            data.questions.forEach(question => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>Question:</strong> ${question.content} 
                    <br>
                    <strong>Reply:</strong> ${question.reply || 'Not yet replied'}
                `;

                // If host is logged in, add a reply interface
                if (login) {
                    const replyInput = document.createElement('input');
                    replyInput.type = 'text';
                    replyInput.placeholder = 'Enter your reply...';

                    const replyButton = document.createElement('button');
                    replyButton.textContent = 'Reply';

                    replyButton.addEventListener('click', async () => {
                        const reply = replyInput.value;
                        try {
                            const response = await fetch(`/reply/${url}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ questionId: question._id, reply })
                            });
                            const data = await response.json();
                            if (data.success) {
                                fetchAndDisplayQuestions(url);  // Refresh the question list
                            }
                        } catch (error) {
                            console.error('Error replying to question:', error);
                        }
                    });

                    li.appendChild(replyInput);
                    li.appendChild(replyButton);
                }

                questionsList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}


document.getElementById('qna-list').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;

    try {
            fetchAndDisplayQuestions(url);
  
    } catch (error) {
        alert('Error submitting question: ' + error.message);
    }
});
