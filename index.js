const { Client } = require('@line/bot-sdk');
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
// === เพิ่มฟังก์ชันแจ้งเตือน BTC แบบสั้นๆ ===
const { Client } = require('@line/bot-sdk');

const userId = 'U378e0720792b4f1e8f94738343a37864'; // <- แทน userId ของคุณ
const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

async function handleBTCNotify() {
  const now = new Date();
  const message = {
    to: userId,
    messages: [
      {
        type: 'text',
        text:
          `🔔 BTC/USD\n` +
          `🕐 Timeframe: 1H\n` +
          `📈 สัญญาณล่าสุด: Buy\n` +
          `📬 อัปเดตล่าสุด: ${now.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}`,
      },
    ],
  };

  try {
    await lineClient.pushMessage(message.to, message.messages);
    console.log("✅ ส่งข้อความ BTC แล้ว");
  } catch (error) {
    console.error("❌ ส่งข้อความไม่สำเร็จ:", error);
  }
}

// === เพิ่ม route ให้ CRON เรียกได้ ===
app.get('/cron/btc', async (req, res) => {
  await handleBTCNotify();
  res.send('✅ BTC cron triggered');
});
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
