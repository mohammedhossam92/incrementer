import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const usersFile = path.join(process.cwd(), 'data', 'users.txt');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const userId = Date.now().toString();
  users.push({ email, password: hashed, userId });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  // Create empty user data file
  fs.writeFileSync(path.join(process.cwd(), 'data', `${userId}.txt`), JSON.stringify({}));
  res.status(201).json({ message: 'User created' });
}