const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/', (req, res) => {
    const body = req.body;

    console.log(JSON.stringify(body));
	handleWebhook(body);

    res.send('OK');
});

async function handleWebhook(data) {
	switch (data.event) {
		case 'PING':
			console.log('Got ping event');
			break;
		case 'DONATION':
			console.log('Got donation event')
			break;
		case 'SUBMISSION_ADD':
			console.log('submission added by ' + data.submission.user.username)
			break;
		case 'SUBMISSION_EDIT':
			console.log('submission edited by ' + data.submission.user.username)
			break;
	}
}

app.listen(3000);
console.log('Listening on http://localhost:3000/');
