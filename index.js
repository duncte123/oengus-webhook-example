const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { sendSubmissionToDiscord } = require('./functions');

app.use(bodyParser.json());
app.use(cors());

app.post('/:marathonId', (req, res) => {
    const body = req.body;
    const marathon = req.params.marathonId

    console.log(JSON.stringify(body));
	handleWebhook(body, marathon);

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
			try {
				await sendSubmissionToDiscord(data.submission);
			} catch (e) {
				console.error(e);
			}
			console.log('submission added by ' + data.submission.user.username)
			break;
		case 'SUBMISSION_EDIT':
			console.log('submission edited by ' + data.submission.user.username)
			break;
	}
}

app.listen(config.port);
console.log(`Listening on http://localhost:${config.port}/`);
