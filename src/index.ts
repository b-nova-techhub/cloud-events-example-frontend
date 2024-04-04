import express from 'express';
import path from 'path';
import {CloudEvent, emitterFor, httpTransport} from "cloudevents";

const emit = emitterFor(httpTransport("http://localhost:8080"));
const app = express();
const port = 3000;

interface ButtonEvent {
    clicked: boolean;
}
interface Activity {
    activity: string;
    type: string;
    participants: number;
    price: number;
    link: string;
    key: string;
    accessibility: number;
}

app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/button-clicked', (req, res) => {
    console.log('Button was clicked!');
    const ce = new CloudEvent<ButtonEvent>({
        type: 'com.bnova.techhub.button.clicked',
        source: 'cloud-events-example-frontend',
        data: { clicked: true },
    });
    emit(ce);

    res.json({ message: 'Button click handled by server!' });
});

app.post('/get-activity', (req, res) => {
    console.log('Get Activity Button was clicked!');
    const ce = new CloudEvent<ButtonEvent>({
        type: 'com.bnova.techhub.get.activity',
        source: 'cloud-events-example-frontend',
        data: { clicked: true },
    });

    emit(ce).then((result) => {
        console.log('Result:', result);
        let ceResultStr = (result as { body: string }).body;
        let ceResult = JSON.parse(ceResultStr) as CloudEvent<Activity>;
        res.json(ceResult.data);
    }).catch(console.error);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

