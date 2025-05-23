const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

// 👇 เปลี่ยนจากเขียน token ตรงๆ มาใช้ process.env
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();

app.post('/webhook', middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: '✅ บอทพร้อมทำงานแล้วครับ!',
  });
}

const port = process.env.PORT || 3000;
app.get("/webhook", (req, res) => {
  res.status(200).send("Webhook alive - Render OK ✅");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
