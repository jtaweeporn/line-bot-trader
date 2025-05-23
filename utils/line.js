const axios = require('axios');
require('dotenv').config(); // โหลด .env ถ้ายังไม่ทำไว้

const LINE_API = 'https://api.line.me/v2/bot/message/push';
const TOKEN = process.env.LINE_ACCESS_TOKEN;

/**
 * ส่งข้อความไปยัง LINE User ID
 * @param {string} userId LINE User ID ของผู้รับ
 * @param {string} message ข้อความที่จะส่ง
 */
async function pushMessage(userId, message) {
  try {
    await axios.post(
      LINE_API,
      {
        to: userId,
        messages: [{ type: 'text', text: message }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );
    console.log('✅ ส่งข้อความ LINE สำเร็จ:', message);
  } catch (error) {
    console.error('❌ ส่งข้อความ LINE ล้มเหลว:', error.message);
  }
}

module.exports = { pushMessage };
