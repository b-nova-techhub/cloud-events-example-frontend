import express from 'express';
import path from 'path';
import {CloudEvent, emitterFor, httpTransport} from "cloudevents";

const emit = emitterFor(httpTransport("http://localhost:8080"));
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/button-clicked', (req, res) => {
    console.log('Button was clicked!');
    const ce = new CloudEvent({
        type: 'com.example.button.clicked',
        source: '/button-clicked',
        data: { clicked: true },
    });
    emit(ce);

    res.json({ message: 'Button click handled by server!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});