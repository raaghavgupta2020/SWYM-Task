const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://raghav:raghav123@cluster0.cxqgbta.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const EventSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    time: String,
    url: String,
    ttl: Date
});

const QuestionSchema = new mongoose.Schema({
    content: String,
    reply: String,
    eventId: mongoose.Schema.Types.ObjectId
});

const Event = mongoose.model('Event', EventSchema);
const Question = mongoose.model('Question', QuestionSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/createEvent', async (req, res) => {
    // In a real application, authenticate the host here
    const event = new Event({
        ...req.body,
        url: shortid.generate(),
        ttl: req.body.ttl ? new Date(req.body.ttl) : undefined
    });
    try {
        await event.save();
        res.send({ success: true, url: event.url });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

app.post('/submitQuestion/:url', async (req, res) => {
    try {
        const event = await Event.findOne({ url: req.params.url });
        if (!event) return res.status(404).send({ success: false, message: 'Event not found' });
        var diff = event.ttl.getMilliseconds() -Date.now()
        console.log(event.ttl);
        const now = new Date();
        console.log(Date.now());
        if( event.ttl.getTime() < now.getTime()){
            // console.log(diff);
            return res.status(401).send({succes: false, message: "Event is expired"});
        }
        const question = new Question({
            content: req.body.content,
            eventId: event._id
        });
        await question.save();

        res.send({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

app.get('/getQuestions/:url', async (req, res) => {
    try {
        const event = await Event.findOne({ url: req.params.url });
        if (!event) return res.status(404).send({ success: false, message: 'Event not found' });

        const questions = await Question.find({ eventId: event._id });
        res.send({ success: true, questions });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
    }
});

app.post('/hostLogin', (req, res) => {
    const { username, password } = req.body;
    // This is a simple check, consider using environment variables or a database in a real-world app
    if (username === "raghav" && password === "raghav123") {
        res.send({ success: true, message: "Logged in!" });
    } else {
        res.status(401).send({ success: false, message: "Invalid credentials" });
    }
});

// app.post('/reply/:questionId', async (req, res) => {
//     try {
//         const question = await Question.findById(req.params.questionId);
//         if (!question) return res.status(404).send({ success: false, message: "Question not found" });
//         question.reply = req.body.reply;
//         await question.save();
//         res.send({ success: true, message: "Reply added successfully" });
//     } catch (err) {
//         res.status(500).send({ success: false, message: err.message });
//     }
// });

app.post('/reply/:url', async (req, res) => {
    const { questionId, reply } = req.body;
    try {
        const event = await Event.findOne({ url: req.params.url });
        if (!event) {
            return res.json({ success: false, message: 'Event not found' });
        }
        const question = event.questions.id(questionId);
        if (!question) {
            return res.json({ success: false, message: 'Question not found' });
        }
        question.reply = reply;
        await event.save();
        res.json({ success: true, message: 'Reply added' });
    } catch (err) {
        res.json({ success: false, message: 'Error adding reply', error: err.message });
    }
});
app.get('/fetchQuestions/:url', async (req, res) => {
    try {
        const event = await Event.findOne({ url: req.params.url });
        if (!event) {
            return res.json({ success: false, message: 'Event not found' });
        }
        const ques = await Question.find({eventId: event._id})
        res.json({ success: true, questions: ques });
    } catch (err) {
        res.json({ success: false, message: 'Error fetching questions', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
