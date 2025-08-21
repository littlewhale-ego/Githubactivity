const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/activity/:username', async (req,res) => {
    const {username} = req.params;

    try{
        const response = await axios.get(`https://api.github.com/users/${username}/events/public`,{headers:{"User-Agent": "GitHub-Activity-App"}});

        const events = response.data.slice(0,5).map((event) => {
            return {
                type: event.type,
                repo: event.repo.name,
                created_at: event.created_at,
            };
        });

        console.log(`\nActivity for ${username}:`);
        events.forEach((e,i) => {
            console.log(`${i + 1}. [${e.type}] ${e.repo} (${e.created_at})`);
            
        });

        res.json(events);
    }catch (error) {
        console.error('Error fetching data from GitHub API:', error.message);
        res.status(500).send('Error fetching data from GitHub API');
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})