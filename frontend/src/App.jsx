import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* You can add a persistent Sidebar or Navbar component here later */}

      <main className='grow'>
        {/* The Outlet renders whatever child route is currently active */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
