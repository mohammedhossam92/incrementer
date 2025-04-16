import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push('/auth/signin');
    } else {
      const data = await res.json();
      setError(data.error || 'Error');
    }
  }

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
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