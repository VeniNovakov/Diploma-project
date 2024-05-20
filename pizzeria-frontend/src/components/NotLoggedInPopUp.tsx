import React from 'react';
import { useIsLoggedIn } from '../providers/LoggedInProvider';

const NotLoggedInComponent = () => {

  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn  ()
  const redirectToLogin = () => {
    window.location.href = '/auth';
  };

  return !isLoggedIn  && window.location.href != window.location.origin + '/auth' ? (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white shadow-md p-8 rounded-lg">
      <h2 className="text-xl font-bold mb-4">You are not logged in!</h2>
      <p className="mb-4">Please log in to access this content.</p>
      <button onClick={redirectToLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Log In
      </button>
    </div>
  ):(<></>)
  }

export default NotLoggedInComponent;
