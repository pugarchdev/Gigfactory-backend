import { createCrudController } from './crudFactory.js';
import prisma from '../config/prisma.js';

const baseController = createCrudController('admin');

const adminsController = {
  ...baseController,
  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const admin = await prisma.admin.findUnique({
        where: { email },
      });

      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (!admin.isActive) {
        return res.status(403).json({ message: 'Account is inactive' });
      }

      // In a production app, we would return a JWT here
      res.json({
        message: 'Login successful',
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export default adminsController;
