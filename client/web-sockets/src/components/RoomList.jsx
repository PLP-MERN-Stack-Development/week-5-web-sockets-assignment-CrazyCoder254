const RoomList = ({ rooms, activeRoom, onSelectRoom }) => {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">Chat Rooms</h3>
      <ul className="space-y-1">
        {rooms.map(room => (
          <li key={room}>
            <button
              onClick={() => onSelectRoom(room)}
              className={`w-full text-left p-2 rounded transition-colors ${
                activeRoom === room
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              # {room}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;