import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      router.push('/dashboard');
    } else {
      setError(data.error || 'Error');
    }
  }

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
        {error && <p className="error">{error}</p>}
      </form>
      <style jsx>{`
        .auth-container { max-width: 400px; margin: 2rem auto; padding: 2rem; background: var(--bg); border-radius: 8px; }
        input, button { width: 100%; margin: 0.5rem 0; padding: 0.75rem; }
        .error { color: red; }
      `}</style>
    </div>
  );
}