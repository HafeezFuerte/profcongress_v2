const express = require('express');

//change for dev/prod/stagging
NODE_ENV="prod"
const axios = require('axios');
const qs = require('qs');
var cors = require('cors')

require('custom-env').env(`${NODE_ENV}`);

const config=require('./config');

var app = express();
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('here we are!!!')
})

const { sql, poolPromise } = require('./db');

const clientID = 'YkZsRUJYQldSUnVaRHBlTFVaN2I6MTpjaQ';
const clientSecret = '_tKubOGd1tgdbs3_BFtaMDkdGXJY_p-6v6s0QmYSA-7BNNnj-Z';

const getBearerToken = async () => {
  const tokenCredentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
  try {
    const response = await axios.post(
      'https://api.twitter.com/oauth2/token',
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Authorization': `Basic ${tokenCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Bearer Token:', error);
    return null;
  }
};

app.get('/tweets', async (req, res) => {
  const username = "ProfCong";
  const token = await getBearerToken();
  if (!token) {
    return res.status(500).json({ error: 'Unable to authenticate with Twitter API' });
  }

  try {
    const response = await axios.get(`https://api.twitter.com/2/tweets?username=${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/home', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM ( SELECT 
        'Home' AS Source, 
        NULL AS id, 
        NULL AS createdTime, 
        title AS title, 
        NULL AS details, 
        topImageUrl AS imageUrl, 
        messageYouTubeId AS youtubeId, 
        whoWeAre, 
        whatWeAre, 
        whatWeCanDo, 
        whatYouWillGet
    FROM [dbo].[Home]

    UNION ALL

    SELECT 
        'Video' AS Source, 
        id, 
        createdTime, 
        title, 
        NULL AS details, 
        thumbNailUrl AS thumbNailUrl, 
        utubeId AS utubeId, 
        NULL AS whoWeAre, 
        NULL AS whatWeAre, 
        NULL AS whatWeCanDo, 
        NULL AS whatYouWillGet
    FROM (
        SELECT 
            id, 
            createdTime, 
            title, 
            thumbNailUrl, 
            utubeId
        FROM [dbo].[Video]
        WHERE isActive = 1
        ORDER BY createdTime DESC
        OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY
    ) AS VideoSubquery

    UNION ALL

    SELECT 
        'Article' AS Source, 
        id, 
        createdTime, 
        title, 
        details, 
        imageUrl, 
        NULL AS youtubeId, 
        NULL AS whoWeAre, 
        NULL AS whatWeAre, 
        NULL AS whatWeCanDo, 
        NULL AS whatYouWillGet
    FROM (
        SELECT 
            id, 
            createdTime, 
            title, 
            details, 
            imageUrl
        FROM [dbo].[Article]
        WHERE isActive = 1
        ORDER BY createdTime DESC
        OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY
    ) AS ArticleSubquery

    UNION ALL

    SELECT 
        'Category' AS Source, 
        id, 
        NULL AS createdTime, 
        name AS title, 
        NULL AS details, 
        imageUrl AS imageUrl, 
        NULL AS youtubeId, 
        NULL AS whoWeAre, 
        NULL AS whatWeAre, 
        NULL AS whatWeCanDo, 
        NULL AS whatYouWillGet
    FROM [dbo].[Category]
) AS CombinedResults
FOR JSON PATH, ROOT('CombinedData')`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// require('./utility/cronJob');  // Import the cron job to start it
require('./ResponseObj');

// Define routes and middleware here

app.listen(process.env.PORT, () => {
    console.log("Server running on port "+process.env.PORT);
});


var v1Route = require("./routes/v1");
app.use("/v1", v1Route)