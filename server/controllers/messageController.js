import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const { room = 'global', limit = 50, skip = 0 } = req.query;
    const messages = await Message.find({ room })
      .populate('sender', 'username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
      
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2, isPrivate: true },
        { sender: userId2, receiver: userId1, isPrivate: true }
      ]
    })
    .populate('sender', 'username')
    .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};