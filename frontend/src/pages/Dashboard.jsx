import { useEffect } from 'react';
import { socket } from '../lib/socket';

export default function Dashboard() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with id:', socket.id);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>Content Repurposer</h1>
      <p className='text-gray-600'>
        Your WebSocket connection should be active. Check your console!
      </p>

      {/* Build the URL input form here */}
    </div>
  );
}
