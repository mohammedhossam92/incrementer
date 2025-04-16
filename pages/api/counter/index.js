import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.userId;
  } catch {
    return null;
  }
}

export default function handler(req, res) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const userFile = path.join(process.cwd(), 'data', `${userId}.txt`);
  if (!fs.existsSync(userFile)) fs.writeFileSync(userFile, JSON.stringify({}));

  if (req.method === 'GET') {
    const data = JSON.parse(fs.readFileSync(userFile, 'utf8'));
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const data = JSON.parse(fs.readFileSync(userFile, 'utf8'));
    const { categories } = req.body;
    fs.writeFileSync(userFile, JSON.stringify(categories, null, 2));
    return res.status(200).json({ message: 'Saved' });
  }

  res.status(405).end();
}