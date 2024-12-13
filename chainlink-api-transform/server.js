const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// APIエンドポイントの設定
const originalApiUrl = 'https://api.odpt.org/api/v4/odpt:TrainInformation?odpt:operator=odpt.Operator:TokyoMetro&acl:consumerKey=ifsiuo2qwoqfznb4dq1iltdxistrlnv7l8ualzeapaqrinp41ew3qle04l8govk1';

app.get('/modified-train-info', async (req, res) => {
  try {
    // 元のAPIからデータを取得
    const response = await axios.get(originalApiUrl);
    const trainInformation = response.data;

    // データの変換
    const modifiedData = trainInformation.map(info => {
      // odpt:trainInformationText の内容に応じて変換
      if (info['odpt:trainInformationText'] && info['odpt:trainInformationText']['ja'] === "現在、平常どおり運転しています。") {
        return {
          ...info,
          'odpt:trainInformationText': 0
        };
      } else {
        return {
          ...info,
          'odpt:trainInformationText': 1
        };
      }
    });

    // 変換したデータをレスポンスとして返す
    res.json(modifiedData);
  } catch (error) {
    console.error('Error fetching train information:', error);
    res.status(500).json({ error: 'Failed to fetch train information' });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

