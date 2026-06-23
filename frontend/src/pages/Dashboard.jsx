import { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from '../lib/socket';
import { Link2, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [platformTarget, setPlatformTarget] = useState('summary');

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [processStatus, setProcessStatus] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server with id:', socket.id);
    });

    socket.on('taskProcessing', (data) => {
      if (data.taskId == activeTaskId) {
        setProcessStatus('processing');
      }
    });

    socket.on('taskCompleted', (data) => {
      if (data.taskId == activeTaskId) {
        setProcessStatus('completed');
        setGeneratedContent(data.content);
      }
    });

    socket.on('taskFailed', (data) => {
      if (data.taskId == activeTaskId) {
        setProcessStatus('failed');
        setErrorMessage(data.error);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('taskProcessing');
      socket.off('taskCompleted');
      socket.off('taskFailed');
    };
  }, [activeTaskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) return;

    setProcessStatus('queuing');
    setGeneratedContent('');
    setErrorMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/tasks/repurpose',
        {
          url: url,
          platformTarget: platformTarget,
        },
      );

      setActiveTaskId(response.data.taskId);
      setUrl('');
    } catch (error) {
      setProcessStatus('failed');
      setErrorMessage(
        error.response?.data?.message ||
          'An error occurred while submitting the task.',
      );
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
              disabled={
                processStatus === 'queuing' || processStatus === 'processing'
              }
              placeholder='Paste a Youtube or Blog URL here...'
              className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50'
              required
            />
          </div>

          <select
            value={platformTarget}
            onChange={(e) => setPlatformTarget(e.target.value)}
            disabled={
              processStatus === 'queuing' || processStatus === 'processing'
            }
            className='border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-70'
          >
            <option value='linkedin'>LinkedIn Post</option>
            <option value='twitter'>Twitter Thread</option>
            <option value='summary'>Quick Summary</option>
          </select>

          <button
            type='submit'
            disabled={
              processStatus === 'queuing' || processStatus === 'processing'
            }
            className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400'
          >
            {processStatus === 'queuing' || processStatus === 'processing' ? (
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

        {/* Live Status Display */}
        {processStatus === 'processing' && (
          <div className='mt-6 flex items-center gap-3 text-blue-600 bg-blue-50 p-4 rounded-lg border border-blue-100'>
            <Loader2 className='animate-spin h-5 w-5' />
            <span className='font-medium'>
              Worker is scraping and formatting your content...
            </span>
          </div>
        )}

        {processStatus === 'failed' && (
          <div className='mt-6 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100'>
            <span className='font-medium'>Error: {errorMessage}</span>
          </div>
        )}
      </div>

      {/* Generated Content Display */}
      {processStatus === 'completed' && generatedContent && (
        <div className='bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <div className='flex items-center gap-2 mb-6'>
            <CheckCircle2 className='h-6 w-6 text-green-500' />
            <h2 className='text-xl font-bold text-gray-900'>
              Your Generated Content
            </h2>
          </div>

          <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
            <p className='text-gray-800 whitespace-pre-wrap'>
              {generatedContent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
