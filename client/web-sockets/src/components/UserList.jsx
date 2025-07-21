const UserList = ({ users, onSelectUser, activeUser }) => {
  return (
    <div className="p-4 border-b">
      <h3 className="font-semibold mb-2">Online Users</h3>
      <ul className="space-y-1">
        {users.filter(u => u.online).map(user => (
          <li key={user.id}>
            <button
              onClick={() => onSelectUser(user)}
              className={`w-full text-left p-2 rounded transition-colors ${
                activeUser?.id === user.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                {user.username}
              </div>
            </button>
          </li>
        ))}
        
        {users.filter(u => !u.online).length > 0 && (
          <>
            <h3 className="font-semibold mt-4 mb-2">Offline Users</h3>
            {users.filter(u => !u.online).map(user => (
              <li key={user.id}>
                <button
                  onClick={() => onSelectUser(user)}
                  className={`w-full text-left p-2 rounded transition-colors ${
                    activeUser?.id === user.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                    {user.username}
                  </div>
                </button>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
};

export default UserList;