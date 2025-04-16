import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CounterApp = dynamic(() => import('../components/CounterApp'), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth/signin');
    }
  }, [router]);
  return (
    <div>
      <CounterApp />
    </div>
  );
}