const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

require('dotenv').config(); // ✅ โหลดไฟล์ .env

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new Client(config);

// ✅ ตรวจว่า Webhook ทำงาน และจับ error
app.post('/webhook', middleware(config), (req, res) => {
  console.log('📥 Webhook received:', JSON.stringify(req.body, null, 2)); // ดู event ที่เข้ามา
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('❌ Webhook handler error:', err); // log error
      res.status(500).end(); // แจ้งว่า error ให้ LINE รู้
    });
});

// ✅ handleEvent = ตอบกลับข้อความ
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null); // ไม่ใช่ข้อความ → ไม่ตอบ
  }

  // ✅ ตอบกลับข้อความ
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: '✅ บอทพร้อมทำงานแล้วครับ!',
  });
}

// ✅ Endpoint สำหรับเช็กว่าเซิร์ฟเวอร์ยังทำงาน
const port = process.env.PORT || 3000;
app.get("/webhook", (req, res) => {
  res.status(200).send("Webhook alive - Render OK ✅");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
