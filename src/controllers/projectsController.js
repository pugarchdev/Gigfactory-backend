import { createCrudController } from './crudFactory.js';
import prisma from '../config/prisma.js';

const baseController = createCrudController('project');

const controller = {
  ...baseController,

  async list(req, res) {
    try {
      const { category, status, name, location, search } = req.query;

      const where = {
        deletedAt: null,
      };

      if (category && category !== 'all') {
        where.category = category;
      }
      if (status && status !== 'all') {
        where.status = status;
      }
      if (name) {
        where.name = { contains: name, mode: 'insensitive' };
      }
      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Order by priority ascending, then by id descending as a fallback
      const items = await prisma.project.findMany({
        where,
        orderBy: [
          { priority: 'asc' },
          { id: 'desc' },
        ],
      });
      res.json(items);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  },

  async create(req, res) {
    try {
      const payload = req.body || {};
      
      // Find the maximum priority currently in the database
      const maxPriorityProject = await prisma.project.findFirst({
        where: { deletedAt: null },
        orderBy: { priority: 'desc' }
      });
      
      // Default gap is 16384 (2^14)
      const nextPriority = maxPriorityProject 
        ? maxPriorityProject.priority + 16384 
        : 16384;
        
      const record = await prisma.project.create({
        data: {
          ...payload,
          priority: nextPriority
        }
      });
      res.status(201).json(record);
    } catch (error) {
      console.error("Failed to create project:", error);
      res.status(500).json({ message: 'Failed to create project' });
    }
  },

  async reorder(req, res) {
    try {
      const id = Number(req.params.id);
      const { prevId, nextId } = req.body;

      const projectToMove = await prisma.project.findFirst({
        where: { id, deletedAt: null }
      });

      if (!projectToMove) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const allProjects = await prisma.project.findMany({
        where: { deletedAt: null },
        orderBy: [
          { priority: 'asc' },
          { id: 'desc' }
        ]
      });

      const DEFAULT_GAP = 16384;

      let prevPriority = 0;
      let nextPriority = null;

      if (prevId) {
        const prevProject = allProjects.find(p => p.id === Number(prevId));
        if (prevProject) {
          prevPriority = prevProject.priority;
        }
      } else {
        // If moving to the top, find the first item that isn't the item itself
        const first = allProjects.find(p => p.id !== id);
        if (first) {
          nextPriority = first.priority;
        }
      }

      if (nextId) {
        const nextProject = allProjects.find(p => p.id === Number(nextId));
        if (nextProject) {
          nextPriority = nextProject.priority;
        }
      } else {
        // If moving to the bottom, find the last item that isn't the item itself
        const last = allProjects.filter(p => p.id !== id).pop();
        if (last) {
          prevPriority = last.priority;
        }
      }

      let newPriority;
      let needsReindex = false;

      if (nextPriority === null) {
        // Moving to the very end
        newPriority = prevPriority + DEFAULT_GAP;
      } else if (!prevId && prevPriority === 0) {
        // Moving to the very beginning
        newPriority = nextPriority - DEFAULT_GAP;
        if (newPriority <= 0) {
          newPriority = Math.floor(nextPriority / 2);
          if (newPriority <= 0) {
            needsReindex = true;
          }
        }
      } else {
        // Moving between two items
        newPriority = Math.floor((prevPriority + nextPriority) / 2);
        if (newPriority === prevPriority || newPriority === nextPriority) {
          needsReindex = true;
        }
      }

      if (needsReindex) {
        // Remove project from current position, insert at target position, then re-index all
        const listWithoutTarget = allProjects.filter(p => p.id !== id);
        
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

        listWithoutTarget.splice(insertIndex, 0, projectToMove);

        // Perform transaction to update all priorities in DB
        await prisma.$transaction(
          listWithoutTarget.map((proj, index) => {
            const updatedPriority = (index + 1) * DEFAULT_GAP;
            if (proj.id === id) {
              newPriority = updatedPriority;
            }
            return prisma.project.update({
              where: { id: proj.id },
              data: { priority: updatedPriority }
            });
          })
        );
      } else {
        // Simply update the project's priority
        await prisma.project.update({
          where: { id },
          data: { priority: newPriority }
        });
      }

      return res.json({ id, priority: newPriority, message: 'Reordered successfully' });
    } catch (error) {
      console.error("Failed to reorder project:", error);
      return res.status(500).json({ message: 'Failed to reorder project' });
    }
  }
};

export default controller;
