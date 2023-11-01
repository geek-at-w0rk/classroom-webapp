const express = require('express');
const mongoose = require('mongoose');
const app = express();
const db = require('./config/database');
const axios = require('axios');
const port = 5000;

const client_id = "h5Qi7bKPTcKhV5Ws3nmaFg";
const account_id = "mTczzyqNT2iI1TgawqunkQ";
const client_secret = "DQYUml7RPGklY7kC0MLmHRaPGrfSkMTX";
const auth_token_url = "https://zoom.us/oauth/token";
const api_base_url = "https://api.zoom.us/v2";

mongoose
  .connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(express.json());

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === '123@abc.com' && password === '12345678') {
    res.sendStatus(200);
  } else {
    res.sendStatus(401); 
  }
});

const createMeeting = async (
  meetingData,
  schedulerEmail,
  participantEmails
) => {
  const authResponse = await axios.request({
    method: "post",
    maxBodyLength: Infinity,
    url: `${auth_token_url}?grant_type=account_credentials&account_id=${account_id}`,
    headers: {
      Authorization:
        "Basic aDVRaTdiS1BUY0toVjVXczNubWFGZzpEUVlVbWw3UlBHa2xZN2tDME1MbUhSYVBHcmZTa01UWA==",
      Cookie:
        "__cf_bm=BEObZRsMtevLOPqR_I9rzHFtDWJ.2dpzHv9xhqV4pCY-1698841833-0-Aar0x3tVwsVn581PKQqd/y4TzdTqVzKH25YBUnOHxYUGXPjlF/D21cqKfPTLazdeEjt2D5vPllcSaKfGaGvjJpA=; _zm_chtaid=162; _zm_ctaid=tn4W9G31SvaY8VY8kBV5NA.1698841832992.8eb6cb4ac463713a0dafb011dd2e93cd; _zm_mtk_guid=945a18b56e5148179f9f924cfcd8c19f; _zm_page_auth=us04_c_awrMqtMdSBeFRlUWhV7EQQ; _zm_ssid=us04_c_JlauQ2IZRQSPFBb5l-11GQ; cred=C19D55172A39C90EAD734AB9C44E39C5",
    },
  });

  if (authResponse.status !== 200) {
    console.log("Unable to get access token");
    return;
  }

  const access_token = authResponse.data.access_token;

  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
  try {
    meetingData.settings = {
      host_video: true,
      participant_video: true,
      join_before_host: false,
    };

    // Set the scheduler's email
    meetingData.settings.host_email = schedulerEmail;
    // Set the participants' emails
    meetingData.settings.participant_email = participantEmails;

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingData,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

app.post("/create-meeting", async (req, res, next) => {
  const { teacherEmail, studentEmail, classDate, classTime } = req.body;
  try {
    const meetingData = {
      topic: "Class Meeting",
      type: 2, // Scheduled meeting
      start_time:`${classDate}T${classTime}:00`,
      duration: 60, // Meeting duration in minutes
    };
    const zoomMeetingDetails = await createMeeting(
      meetingData,
      teacherEmail,
      studentEmail
    );
    const { id, join_url, start_time } = zoomMeetingDetails;
    if (join_url) {
      //res.sendStatus(200);
      //res.send({status : 200, data: {join_url: join_url} })
      res.status(200).json(join_url)
    } else {
      res.sendStatus(401); 
    }
    
  } catch (error) {
    console.error("Zoom API Error:", error);
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});