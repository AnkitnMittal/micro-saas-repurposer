import { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from '../lib/socket';
import { Link2, Sparkles, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [platformTarget, setPlatformTarget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with id:', socket.id);
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      alert('Please enter a URL');
      return;
    }

    setIsSubmitting(true);
    setResponseMessage('');

    try {
      const response = await axios.post(
        'http://localhost::5000/api/tasks/repurpose',
        {
          url: url,
          platformTarget: platformTarget,
        },
      );

      console.log('Server response:', response.data);
      setResponseMessage(
        `Success! Task created with ID: ${response.data.taskId}`,
      );

      setUrl('');
    } catch (error) {
      console.error('Error submitting task:', error);
      setResponseMessage('Error submitting task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-8 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-gray-900'>
        Content Repurposer
      </h1>

      {/* Build the URL input form here */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8'>
        <h2 className='text-lg font-semibold mb-4 text-gray-800'>
          Repurpose a Link
        </h2>

        <form onSubmit={handleSubmit} className='flex gap-4'>
          <div className='relative grow'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Link2 className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='url'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='Paste a Youtube or Blog URL here...'
              className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none'
              required
            />
          </div>

          <select
            value={platformTarget}
            onChange={(e) => setPlatformTarget(e.target.value)}
            className='border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none'
          >
            <option value='linkedin'>LinkedIn</option>
            <option value='twitter'>Twitter</option>
            <option value='summary'>Summary</option>
          </select>

          <button
            type='submit'
            disabled={isSubmitting}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='animate-spin h-5 w-5' />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className='h-5 w-5' />
                Generate
              </>
            )}
          </button>
        </form>

        {/* Temporary response feedback display */}
        {responseMessage && (
          <div className='mt-4 p-3 rounded-lg text-sm ${responseMessage.includes("Success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}'>
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
}
