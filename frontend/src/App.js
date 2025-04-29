import Signup from './components/Signup';
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect } from 'react';
import {useSelector,useDispatch} from "react-redux";
import io from "socket.io-client";
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/userSlice';
import { BASE_URL } from '.';
import AdminPanel from './components/AdminPanel';

const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path: "/admin",
    element: <AdminPanel />
  }
])

function App() { 
  const {authUser} = useSelector(store=>store.user);
  const {socket} = useSelector(store=>store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    let socketio;

    if (authUser) {
      socketio = io(`${BASE_URL}`, {
        query: {
          userId: authUser._id
        }
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
    }

    return () => {
      if (socketio) {
        socketio.close();
      }
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    };
  }, [authUser, dispatch]); 

  return (
    <div className="p-4 h-screen flex flex-col items-center justify-center">
      {/* Display login status */}
      <div className="mb-4 bg-black text-black px-6 py-3 rounded-lg shadow-lg">
        {authUser ? (
          <p className="text-green-500">Logged in as {authUser.username}</p>
        ) : (
          <p className="text-red-500">Not logged in</p>
        )}
      </div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
