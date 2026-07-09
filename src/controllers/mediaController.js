import prisma from '../config/prisma.js';

const DEFAULT_GAP = 16384;

const controller = {
  async list(req, res) {
    try {
      const { type, status, search } = req.query;
      const page = req.query.page ? parseInt(req.query.page, 10) : null;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

      // Check if request is from an authenticated admin
      const adminEmail = req.headers['x-admin-email'];
      let isAdmin = false;
      if (adminEmail) {
        const admin = await prisma.admin.findUnique({
          where: { email: adminEmail }
        });
        if (admin && admin.isActive && !admin.deletedAt) {
          isAdmin = true;
        }
      }

      // Enforce status='published' naturally for non-admin requests
      if (!isAdmin) {
        if (status && status !== 'published') {
          return res.status(403).json({ message: 'Forbidden: You do not have permission to access non-published media' });
        }
      }

      const where = {
        deletedAt: null,
      };

      if (type) {
        where.type = type;
      } else {
        where.type = { not: 'logo' };
      }

      if (!isAdmin) {
        where.status = 'published';
      } else if (status) {
        where.status = status;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Determine sorting logic
      let orderBy = [];

      if (type === 'blog') {
        // Fetch blog sorting settings
        const sortSetting = await prisma.mediaSetting.findUnique({
          where: { key: 'blog_sort_by' },
        });
        const blogSortBy = sortSetting ? sortSetting.value : 'date';

        if (blogSortBy === 'priority') {
          orderBy = [
            { isPinned: 'desc' },
            { priority: 'asc' },
            { id: 'desc' }
          ];
        } else {
          orderBy = [
            { isPinned: 'desc' },
            { publishedAt: 'desc' },
            { id: 'desc' }
          ];
        }
      } else if (type === 'achievement') {
        orderBy = [
          { isPinned: 'desc' },
          { priority: 'asc' },
          { id: 'desc' }
        ];
      } else if (type === 'logo') {
        orderBy = [
          { priority: 'asc' },
          { id: 'desc' }
        ];
      } else {
        // General fallback sorting (which excludes logos)
        orderBy = [
          { isPinned: 'desc' },
          { createdAt: 'desc' }
        ];
      }

      // Fetch count and items
      const total = await prisma.media.count({ where });

      const findOptions = {
        where,
        orderBy,
      };

      if (page && limit) {
        findOptions.skip = (page - 1) * limit;
        findOptions.take = limit;
      }

      const items = await prisma.media.findMany(findOptions);

      // Hide priority and metadata from frontend response depending on auth
      const sanitizedItems = items.map(item => {
        if (!isAdmin) {
          const { priority, deletedAt, updatedAt, ...rest } = item;
          return rest;
        } else {
          const { priority, ...rest } = item;
          return rest;
        }
      });

      if (page && limit) {
        return res.json({
          data: sanitizedItems,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          }
        });
      }

      return res.json(sanitizedItems);
    } catch (error) {
      console.error("Failed to fetch media:", error);
      return res.status(500).json({ message: 'Failed to fetch media items' });
    }
  },

  async getById(req, res) {
    try {
      const param = req.params.id;
      const isNum = !isNaN(Number(param));

      // Check if request is from an authenticated admin
      const adminEmail = req.headers['x-admin-email'];
      let isAdmin = false;
      if (adminEmail) {
        const admin = await prisma.admin.findUnique({
          where: { email: adminEmail }
        });
        if (admin && admin.isActive && !admin.deletedAt) {
          isAdmin = true;
        }
      }

      const item = await prisma.media.findFirst({
        where: {
          deletedAt: null,
          ...(isNum ? { id: Number(param) } : { slug: param })
        }
      });

      if (!item) {
        return res.status(404).json({ message: 'Media item not found' });
      }

      if (!isAdmin && item.status !== 'published') {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to access this item' });
      }

      // Hide priority and metadata from frontend response depending on auth
      if (!isAdmin) {
        const { priority, deletedAt, updatedAt, ...rest } = item;
        return res.json(rest);
      } else {
        const { priority, ...rest } = item;
        return res.json(rest);
      }
    } catch (error) {
      console.error("Failed to fetch media item:", error);
      return res.status(500).json({ message: 'Failed to fetch media item' });
    }
  },

  async create(req, res) {
    try {
      const payload = req.body || {};
      const { type } = payload;

      if (!type || (type !== 'blog' && type !== 'achievement' && type !== 'logo')) {
        return res.status(400).json({ message: 'Valid type ("blog", "achievement" or "logo") is required' });
      }

      // Automatically compute next priority for manual ordering
      const maxPriorityItem = await prisma.media.findFirst({
        where: { type, deletedAt: null },
        orderBy: { priority: 'desc' }
      });

      const nextPriority = maxPriorityItem 
        ? maxPriorityItem.priority + DEFAULT_GAP 
        : DEFAULT_GAP;

      const record = await prisma.media.create({
        data: {
          ...payload,
          priority: nextPriority
        }
      });

      const { priority, ...rest } = record;
      res.status(201).json(rest);
    } catch (error) {
      console.error("Failed to create media item:", error);
      res.status(500).json({ message: 'Failed to create media item' });
    }
  },

  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const existing = await prisma.media.findFirst({
        where: { id, deletedAt: null },
      });
      if (!existing) {
        return res.status(404).json({ message: 'Media item not found' });
      }

      const updated = await prisma.media.update({
        where: { id },
        data: req.body || {},
      });

      const { priority, ...rest } = updated;
      return res.json(rest);
    } catch (error) {
      console.error("Failed to update media item:", error);
      return res.status(500).json({ message: 'Failed to update media item' });
    }
  },

  async reorder(req, res) {
    try {
      const id = Number(req.params.id);
      const { prevId, nextId } = req.body;

      const itemToMove = await prisma.media.findFirst({
        where: { id, deletedAt: null }
      });

      if (!itemToMove) {
        return res.status(404).json({ message: 'Media item not found' });
      }

      const type = itemToMove.type;

      const allItems = await prisma.media.findMany({
        where: { type, deletedAt: null },
        orderBy: [
          { priority: 'asc' },
          { id: 'desc' }
        ]
      });

      let prevPriority = 0;
      let nextPriority = null;

      if (prevId) {
        const prevItem = allItems.find(p => p.id === Number(prevId));
        if (prevItem) {
          prevPriority = prevItem.priority;
        }
      } else {
        const first = allItems.find(p => p.id !== id);
        if (first) {
          nextPriority = first.priority;
        }
      }

      if (nextId) {
        const nextItem = allItems.find(p => p.id === Number(nextId));
        if (nextItem) {
          nextPriority = nextItem.priority;
        }
      } else {
        const last = allItems.filter(p => p.id !== id).pop();
        if (last) {
          prevPriority = last.priority;
        }
      }

      let newPriority;
      let needsReindex = false;

      if (nextPriority === null) {
        newPriority = prevPriority + DEFAULT_GAP;
      } else if (!prevId && prevPriority === 0) {
        newPriority = nextPriority - DEFAULT_GAP;
        if (newPriority <= 0) {
          newPriority = Math.floor(nextPriority / 2);
          if (newPriority <= 0) {
            needsReindex = true;
          }
        }
      } else {
        newPriority = Math.floor((prevPriority + nextPriority) / 2);
        if (newPriority === prevPriority || newPriority === nextPriority) {
          needsReindex = true;
        }
      }

      if (needsReindex) {
        const listWithoutTarget = allItems.filter(p => p.id !== id);
        
        let insertIndex = 0;
        if (prevId) {
          const pIdx = listWithoutTarget.findIndex(p => p.id === Number(prevId));
          if (pIdx !== -1) {
            insertIndex = pIdx + 1;
          }
        } else if (nextId) {
          const nIdx = listWithoutTarget.findIndex(p => p.id === Number(nextId));
          if (nIdx !== -1) {
            insertIndex = nIdx;
          }
        } else {
          insertIndex = listWithoutTarget.length;
        }

        listWithoutTarget.splice(insertIndex, 0, itemToMove);

        await prisma.$transaction(
          listWithoutTarget.map((item, index) => {
            const updatedPriority = (index + 1) * DEFAULT_GAP;
            if (item.id === id) {
              newPriority = updatedPriority;
            }
            return prisma.media.update({
              where: { id: item.id },
              data: { priority: updatedPriority }
            });
          })
        );
      } else {
        await prisma.media.update({
          where: { id },
          data: { priority: newPriority }
        });
      }

      return res.json({ id, message: 'Reordered successfully' });
    } catch (error) {
      console.error("Failed to reorder media item:", error);
      return res.status(500).json({ message: 'Failed to reorder media item' });
    }
  },

  async remove(req, res) {
    try {
      const id = Number(req.params.id);
      const existing = await prisma.media.findFirst({
        where: { id, deletedAt: null },
      });
      if (!existing) {
        return res.status(404).json({ message: 'Media item not found' });
      }
      const deleted = await prisma.media.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      
      const { priority, ...rest } = deleted;
      return res.json({ message: 'Deleted', data: rest });
    } catch (error) {
      console.error("Failed to delete media item:", error);
      return res.status(500).json({ message: 'Failed to delete media item' });
    }
  }
};

export default controller;
