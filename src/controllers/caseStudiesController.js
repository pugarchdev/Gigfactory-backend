import { createCrudController } from './crudFactory.js';
import prisma from '../config/prisma.js';

const baseController = createCrudController('caseStudy');

const controller = {
  ...baseController,

  async list(req, res) {
    try {
      const page = req.query.page ? parseInt(req.query.page, 10) : null;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

      const where = {
        deletedAt: null,
      };

      const total = await prisma.caseStudy.count({ where });

      const findOptions = {
        where,
        orderBy: [
          { id: 'asc' },
        ],
      };

      if (page && limit) {
        findOptions.skip = (page - 1) * limit;
        findOptions.take = limit;
      }

      const items = await prisma.caseStudy.findMany(findOptions);

      if (page && limit) {
        return res.json({
          data: items,
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

      // If no page/limit, keep database order as desc (reordered on client for non-paginated requests)
      const itemsDesc = await prisma.caseStudy.findMany({
        where,
        orderBy: { id: 'desc' },
      });
      res.json(itemsDesc);
    } catch (error) {
      console.error("Failed to fetch case studies:", error);
      res.status(500).json({ message: 'Failed to fetch case studies' });
    }
  }
};

export default controller;

