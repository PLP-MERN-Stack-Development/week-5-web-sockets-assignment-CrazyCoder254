import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';

let ioInstance;

export const initSocketService = (io) => {
  ioInstance = io;
  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return next(new Error('User not found'));
      
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.user.username}`);
    
    // Update user status
    await User.findByIdAndUpdate(socket.user._id, { online: true });
    io.emit('user_online', socket.user._id);
    
    // Join rooms
    socket.join(socket.user._id);
    socket.join('global');
    
    // Handle messages
    socket.on('send_message', async (messageData) => {
      try {
        const message = new Message({
          content: messageData.content,
          sender: socket.user._id,
          receiver: messageData.receiver,
          room: messageData.room || 'global',
          isPrivate: !!messageData.receiver,
        });
        
        await message.save();
        
        // Populate sender info
        const populated = await message.populate('sender', 'username');
        
        if (messageData.receiver) {
          // Private message
          socket.to(messageData.receiver).to(socket.user._id).emit('receive_message', populated);
        } else {
          // Room message
          io.to(messageData.room || 'global').emit('receive_message', populated);
        }
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });
    
    // Handle typing indicator
    socket.on('typing', (data) => {
      const { room, isTyping } = data;
      if (room) {
        socket.to(room).emit('user_typing', {
          userId: socket.user._id,
          isTyping
        });
      } else {
        socket.to('global').emit('user_typing', {
          userId: socket.user._id,
          isTyping
        });
      }
    });
    
    // Handle read receipts
    socket.on('mark_read', async (messageId) => {
      try {
        const message = await Message.findById(messageId);
        if (message && message.receiver?.toString() === socket.user._id.toString()) {
          message.status = 'read';
          await message.save();
          io.to(message.sender).emit('message_status', {
            messageId,
            status: 'read'
          });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.username}`);
      await User.findByIdAndUpdate(socket.user._id, {
        online: false,
        lastSeen: new Date()
      });
      io.emit('user_offline', socket.user._id);
    });
  });
};

export const getIO = () => ioInstance;