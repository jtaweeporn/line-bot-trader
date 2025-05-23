const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const { pushMessage } = require('./utils/line'); // ✅ ดึงฟังก์ชัน pushMessage เข้ามา

// 👇 ใช้ค่า ENV
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new Client(config);

// ✅ ทดสอบส่งข้อความ LINE (ใส่ userId ของคุณแทน <USER_ID>)
pushMessage('<U378e0720792b4f1e8f94738343a37864>', '🚀 ทดสอบส่งข้อความจาก index.js สำเร็จแล้วครับ!');

app.use(express.json());

app.post('/webhook', middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userId = event.source.userId;
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `✅ บอทพร้อมทำงานแล้วครับ!\n👤 userId ของคุณคือ: ${userId}`,
  });
}

const port = process.env.PORT || 3000;
app.get("/webhook", (req, res) => {
  res.status(200).send("Webhook alive - Render OK ✅");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
