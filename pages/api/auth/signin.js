import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const usersFile = path.join(process.cwd(), 'data', 'users.txt');
const JWT_SECRET = 'your_secret_key'; // Use env var in production

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  if (!fs.existsSync(usersFile)) return res.status(401).json({ error: 'Invalid credentials' });
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(200).json({ token, userId: user.userId });
}