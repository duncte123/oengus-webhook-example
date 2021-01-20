const config = require('./config');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');

const marathonNames = {};

const client = axios.create({
    headers: {
        'User-Agent': config.userAgent,
    },
});

const discordClient = rateLimit(
    client,
    {
        // 4 max requests per one second (should be good)
        maxRequests: 4,
        perMilliseconds: 1000,
    }
);

async function getMarathonName(marathonId) {
    if (marathonId in marathonNames) {
        return marathonNames[marathonId];
    }

    const {data} = await client.get(`https://oengus.io/api/marathon/${marathonId}`);

    // cache the marathon name
    marathonNames[marathonId] = data.name;

    return data.name;
}

async function sendSubmissionToDiscord(submission, marathonId) {
    const toAnnounce = [];
    const marathon = await getMarathonName(marathonId);
    const submissionsUrl = `https://oengus.io/marathon/${marathonId}/submissions`;

    submission.games.forEach(game => {
        game.categories.forEach(category => {
            toAnnounce.push({
                catDesc: category.description,
                catId: category.id,
                categoryName: category.name,
                categoryEstimate: category.estimate,
                consoleName: game.console,
                gameDesc: game.description,
                gameName: game.name,
                userName: submission.user.username,
            });
        });
    });

    for (const info of toAnnounce) {
        await formatSendSubmission(info, marathon, submissionsUrl)
            // log errors
            .catch((e) => {
                console.error(e);
            });
    }
}

// adapted from https://github.com/bingothon/oengus-submission-discord-bot
async function formatSendSubmission(info, marathonName, submissionUrl) {
    return discordClient.post(`https://discord.com/api/v8/channels/${config.textChannel}/messages`, {
            embed: {
                title: `${info.userName} submitted a new run!`,
                url: submissionUrl,
                color: 0x5c88bc,
                description: `**Event**: ${marathonName}\n\n**Game**: ${info.gameName}\n**Category**: ${info.categoryName}\n**Platform**: ${info.consoleName}\n**Estimate**: ${info.categoryEstimate}`,
                footer: {text: `ID: ${info.catId}`},
            }
        },
        {
            headers: {
                'Authorization': `Bot ${config.botToken}`
            },
        }
    );
}

module.exports = {
    sendSubmissionToDiscord: sendSubmissionToDiscord,
};
