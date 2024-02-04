import dbConnect from '../../databases/app';
import Message from '../../models/Messages';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { username, message, user, msgId, timestamp } = req.body;
    try {
      const newMessage = new Message({ username, message, user, msgId, timestamp });
      await newMessage.save();
      res.status(201).json({ message: 'Message saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { msgId } = req.query;
    console.log(msgId);
    try {
      // Find the message by msgId and delete it
      const deletedMessage = await Message.findOneAndDelete({ msgId });

      if (!deletedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }

      return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
