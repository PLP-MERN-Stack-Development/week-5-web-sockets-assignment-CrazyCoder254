import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Sidebar = ({ rooms, activeRoom, onRoomChange, onLogout }) => {
  const { currentUser } = useAuth();
  
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Chat App</h1>
        <div className="text-sm text-gray-400 mt-1">
          Welcome, {currentUser.username}
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Rooms</h2>
        <ul className="space-y-1">
          {rooms.map(room => (
            <li key={room}>
              <button
                onClick={() => onRoomChange(room)}
                className={`w-full text-left p-2 rounded transition-colors ${
                  activeRoom === room 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                # {room}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;