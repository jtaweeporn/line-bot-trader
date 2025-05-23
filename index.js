const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'qvbZbsU24w2ENTihi+immN9Nr8bA2fPGmlzdzk0+EuZUl2BUCV3d+3DbdNT0+y1zoXGwbrT7+xV0VQz+WR8+D4gioOLUmNp1f4QPszz6USC2DNicP1sMOm5HaR5CwN7lWTLTsto/zjsxRvZh+bSSrwdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'd7f3e33dbaac6b35a26bdbd1fa28fa98',
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
  res.status(200).send("Webhook alive - UptimeRobot OK ✅");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
