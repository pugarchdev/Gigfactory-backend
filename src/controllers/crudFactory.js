import prisma from '../config/prisma.js';

export function createCrudController(modelName) {
  const model = prisma[modelName];
  const activeWhere = { deletedAt: null };

  return {
    async list(req, res) {
      try {
        const items = await model.findMany({
          where: activeWhere,
          orderBy: { id: 'desc' },
        });
        res.json(items);
      } catch (error) {
        console.error("Failed to fetch records:", error);
        res.status(500).json({ message: 'Failed to fetch records' });
      }
    },

    async count(req, res) {
      try {
        const count = await model.count({ where: activeWhere });
        res.json({ count });
      } catch (error) {
        console.error("Failed to count records:", error);
        res.status(500).json({ message: 'Failed to count records' });
      }
    },

    async getById(req, res) {
      try {
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id);
        const item = await model.findFirst({
          where: { id, ...activeWhere },
        });
        if (!item) {
          return res.status(404).json({ message: 'Record not found' });
        }
        return res.json(item);
      } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch record' });
      }
    },

    async create(req, res) {
      try {
        const payload = req.body || {};
        const record = await model.create({ data: payload });
        res.status(201).json(record);
      } catch (error) {
        console.error("Failed to create record:", error);
        res.status(500).json({ message: 'Failed to create record' });
      }
    },

    async update(req, res) {
      try {
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id);
        const existing = await model.findFirst({
          where: { id, ...activeWhere },
        });
        if (!existing) {
          return res.status(404).json({ message: 'Record not found' });
        }
        const updated = await model.update({
          where: { id },
          data: req.body || {},
        });
        return res.json(updated);
      } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ message: 'Failed to update record' });
      }
    },

    async remove(req, res) {
      try {
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id);

        const existing = await model.findFirst({
          where: { id, ...activeWhere },
        });
        if (!existing) {
          return res.status(404).json({ message: 'Record not found' });
        }
        const deleted = await model.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
        return res.json({ message: 'Deleted', data: deleted });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to delete record' });
      }
    },
  };
}

