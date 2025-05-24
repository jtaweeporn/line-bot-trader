const axios = require('axios');

// Access Token ของ LINE Bot (ใช้ของคุณเอง)
const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// ฟังก์ชันส่งข้อความไปยัง LINE
async function sendLineNotify(message) {
  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/broadcast',
      {
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
        },
      }
    );
    console.log('[LINE] ส่งข้อความเรียบร้อย:', message);
  } catch (error) {
    console.error('[LINE] ส่งข้อความล้มเหลว:', error.response?.data || error.message);
  }
}

module.exports = { sendLineNotify };
