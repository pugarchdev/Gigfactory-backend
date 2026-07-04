import prisma from '../config/prisma.js';

const settingsController = {
  async getSettings(req, res) {
    try {
      const setting = await prisma.mediaSetting.findUnique({
        where: { key: 'blog_sort_by' },
      });
      res.json({ blogSortBy: setting ? setting.value : 'date' });
    } catch (error) {
      console.error("Failed to get media settings:", error);
      res.status(500).json({ message: 'Failed to get media settings' });
    }
  },

  async updateSettings(req, res) {
    try {
      const { blogSortBy } = req.body;
      if (!blogSortBy || (blogSortBy !== 'date' && blogSortBy !== 'priority')) {
        return res.status(400).json({ message: 'Valid blogSortBy ("date" or "priority") is required' });
      }

      const updated = await prisma.mediaSetting.upsert({
        where: { key: 'blog_sort_by' },
        update: { value: blogSortBy },
        create: { key: 'blog_sort_by', value: blogSortBy },
      });

      res.json({ blogSortBy: updated.value });
    } catch (error) {
      console.error("Failed to update media settings:", error);
      res.status(500).json({ message: 'Failed to update media settings' });
    }
  }
};

export default settingsController;
