import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

const USERS_SOURCE_DATA = './data/users.json';

// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.get('/users', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const fileContent = await fs.readFile(USERS_SOURCE_DATA);

  const usersData = JSON.parse(fileContent);

  res.status(200).json({ users: usersData });
});

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  const userFileContent = await fs.readFile(USERS_SOURCE_DATA);
  const usersData = JSON.parse(userFileContent);

  const userIndex = usersData.findIndex((u) => u.id === userId);

  let updatedUsers = usersData;

  if (userIndex >= 0) {
    updatedUsers.splice(userIndex, 1);
  }

  await fs.writeFile(USERS_SOURCE_DATA, JSON.stringify(updatedUsers));

  res.status(200).json({ users: updatedUsers });
});

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(3000);
