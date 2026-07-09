import prisma from '../config/prisma.js';

export async function requireAdmin(req, res, next) {
  try {
    const adminEmail = req.headers['x-admin-email'];
    if (!adminEmail) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required' });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: adminEmail }
    });

    if (!admin || !admin.isActive || admin.deletedAt) {
      return res.status(403).json({ message: 'Forbidden: Invalid or inactive admin account' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
}
