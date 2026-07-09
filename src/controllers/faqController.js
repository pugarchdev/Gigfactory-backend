import { createCrudController } from './crudFactory.js';
import prisma from '../config/prisma.js';

const baseController = createCrudController('fAQ');

const controller = {
  ...baseController,

  async create(req, res) {
    try {
      const payload = req.body || {};
      
      // Find the maximum priority currently in the database for FAQs
      const maxPriorityFaq = await prisma.fAQ.findFirst({
        where: { deletedAt: null },
        orderBy: { priority: 'desc' }
      });
      
      const DEFAULT_GAP = 16384;
      const nextPriority = maxPriorityFaq 
        ? maxPriorityFaq.priority + DEFAULT_GAP 
        : DEFAULT_GAP;
        
      const record = await prisma.fAQ.create({
        data: {
          ...payload,
          priority: nextPriority
        }
      });
      res.status(201).json(record);
    } catch (error) {
      console.error("Failed to create FAQ:", error);
      res.status(500).json({ message: 'Failed to create FAQ' });
    }
  },

  async list(req, res) {
    try {
      const { search, sortBy, sortOrder, page, limit } = req.query;

      const where = { deletedAt: null };

      if (search) {
        where.OR = [
          { q: { contains: search, mode: 'insensitive' } },
          { a: { contains: search, mode: 'insensitive' } }
        ];
      }

      let orderBy = [];
      if (sortBy) {
        const direction = sortOrder === 'desc' ? 'desc' : 'asc';
        if (sortBy === 'date' || sortBy === 'createdAt') {
          orderBy.push({ createdAt: direction });
        } else if (sortBy === 'q') {
          orderBy.push({ q: direction });
        } else if (sortBy === 'mostAsked') {
          orderBy.push({ mostAsked: direction });
        } else if (sortBy === 'priority') {
          orderBy.push({ priority: direction });
        } else {
          orderBy.push({ priority: 'asc' });
        }
      } else {
        orderBy = [
          { mostAsked: 'desc' },
          { priority: 'asc' }
        ];
      }
      
      orderBy.push({ id: 'asc' });

      if (page || limit) {
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = parseInt(limit, 10) || 10;
        const skip = (parsedPage - 1) * parsedLimit;

        const [items, total] = await Promise.all([
          prisma.fAQ.findMany({
            where,
            orderBy,
            skip,
            take: parsedLimit,
          }),
          prisma.fAQ.count({ where }),
        ]);

        const totalPages = Math.ceil(total / parsedLimit);
        const hasMore = parsedPage < totalPages;

        return res.json({
          items,
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages,
          hasMore,
        });
      }

      const items = await prisma.fAQ.findMany({
        where,
        orderBy,
      });
      res.json(items);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
      res.status(500).json({ message: 'Failed to fetch FAQs' });
    }
  },

  async bulkCreate(req, res) {
    try {
      const { faqs = [], strategy = 'add_to_bottom' } = req.body;
      
      if (!Array.isArray(faqs) || faqs.length === 0) {
        return res.status(400).json({ message: 'No FAQs provided' });
      }

      // Clean/validate faqs
      const validatedFaqs = faqs.map(f => ({
        q: (f.q || '').trim(),
        a: (f.a || '').trim(),
        mostAsked: !!f.mostAsked,
        priority: typeof f.priority === 'number' ? f.priority : 0
      })).filter(f => f.q && f.a);

      if (validatedFaqs.length === 0) {
        return res.status(400).json({ message: 'No valid FAQs after validation. Questions and answers cannot be empty.' });
      }

      // Fetch all existing active FAQs
      const existingFaqs = await prisma.fAQ.findMany({
        where: { deletedAt: null },
        orderBy: { priority: 'asc' }
      });

      let combinedFaqs = [];
      const DEFAULT_GAP = 16384;

      if (strategy === 'add_to_top') {
        // Prepend new FAQs
        combinedFaqs = [...validatedFaqs, ...existingFaqs];
      } else if (strategy === 'alphabetical') {
        // Combine and sort all alphabetically by question
        const all = [...existingFaqs, ...validatedFaqs];
        all.sort((a, b) => a.q.localeCompare(b.q));
        combinedFaqs = all;
      } else if (strategy === 'new_alphabetical_append') {
        // Sort new ones alphabetically, then append to existing
        const sortedNew = [...validatedFaqs];
        sortedNew.sort((a, b) => a.q.localeCompare(b.q));
        combinedFaqs = [...existingFaqs, ...sortedNew];
      } else if (strategy === 'random') {
        // Shuffle new ones, then append to existing
        const shuffledNew = [...validatedFaqs];
        for (let i = shuffledNew.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledNew[i], shuffledNew[j]] = [shuffledNew[j], shuffledNew[i]];
        }
        combinedFaqs = [...existingFaqs, ...shuffledNew];
      } else {
        // add_to_bottom (default)
        combinedFaqs = [...existingFaqs, ...validatedFaqs];
      }

      // Save/update everything in a transaction to assign new priorities.
      const results = await prisma.$transaction(
        combinedFaqs.map((faq, index) => {
          const updatedPriority = (index + 1) * DEFAULT_GAP;
          
          if (faq.id) {
            // Existing FAQ - update priority
            return prisma.fAQ.update({
              where: { id: faq.id },
              data: { priority: updatedPriority }
            });
          } else {
            // New FAQ - create it
            return prisma.fAQ.create({
              data: {
                q: faq.q,
                a: faq.a,
                mostAsked: faq.mostAsked,
                priority: updatedPriority
              }
            });
          }
        })
      );

      return res.status(201).json({
        message: `Successfully processed ${results.length} FAQs`,
        count: validatedFaqs.length,
        data: results.filter(item => !existingFaqs.some(ef => ef.id === item.id))
      });
    } catch (error) {
      console.error("Failed to bulk create FAQs:", error);
      return res.status(500).json({ message: 'Failed to bulk create FAQs' });
    }
  },

  async reorder(req, res) {
    try {
      const id = Number(req.params.id);
      const { prevId, nextId } = req.body;

      const faqToMove = await prisma.fAQ.findFirst({
        where: { id, deletedAt: null }
      });

      if (!faqToMove) {
        return res.status(404).json({ message: 'FAQ not found' });
      }

      const allFaqs = await prisma.fAQ.findMany({
        where: { deletedAt: null },
        orderBy: [
          { mostAsked: 'desc' },
          { priority: 'asc' },
          { id: 'asc' }
        ]
      });

      const DEFAULT_GAP = 16384;

      let prevPriority = 0;
      let nextPriority = null;

      if (prevId) {
        const prevFaq = allFaqs.find(f => f.id === Number(prevId));
        if (prevFaq) {
          prevPriority = prevFaq.priority;
        }
      } else {
        const first = allFaqs.find(f => f.id !== id);
        if (first) {
          nextPriority = first.priority;
        }
      }

      if (nextId) {
        const nextFaq = allFaqs.find(f => f.id === Number(nextId));
        if (nextFaq) {
          nextPriority = nextFaq.priority;
        }
      } else {
        const last = allFaqs.filter(f => f.id !== id).pop();
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
        const listWithoutTarget = allFaqs.filter(f => f.id !== id);
        
        let insertIndex = 0;
        if (prevId) {
          const pIdx = listWithoutTarget.findIndex(f => f.id === Number(prevId));
          if (pIdx !== -1) {
            insertIndex = pIdx + 1;
          }
        } else if (nextId) {
          const nIdx = listWithoutTarget.findIndex(f => f.id === Number(nextId));
          if (nIdx !== -1) {
            insertIndex = nIdx;
          }
        } else {
          insertIndex = listWithoutTarget.length;
        }

        listWithoutTarget.splice(insertIndex, 0, faqToMove);

        await prisma.$transaction(
          listWithoutTarget.map((faq, index) => {
            const updatedPriority = (index + 1) * DEFAULT_GAP;
            if (faq.id === id) {
              newPriority = updatedPriority;
            }
            return prisma.fAQ.update({
              where: { id: faq.id },
              data: { priority: updatedPriority }
            });
          })
        );
      } else {
        await prisma.fAQ.update({
          where: { id },
          data: { priority: newPriority }
        });
      }

      return res.json({ id, priority: newPriority, message: 'Reordered successfully' });
    } catch (error) {
      console.error("Failed to reorder FAQ:", error);
      return res.status(500).json({ message: 'Failed to reorder FAQ' });
    }
  }
};

export default controller;
