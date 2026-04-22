import { createCrudController } from './crudFactory.js';
import prisma from '../config/prisma.js';
import { sendGigExpertFeedbackEmail } from '../config/mailer.js';

const controller = createCrudController('gigExpertFeedback');

// Override create to add email notification
const originalCreate = controller.create;
controller.create = async (req, res) => {
  try {
    // 1. Create record using prisma directly to get the returned data
    const payload = req.body || {};
    const record = await prisma.gigExpertFeedback.create({
      data: {
        name: payload.name || 'Anonymous',
        expertType: payload.expertType || null,
        expertTypeOther: payload.expertTypeOther || null,
        experience: payload.experience || null,
        phone: payload.phone || null,
        email: payload.email || null,
        location: payload.location || null,
        workGeography: payload.workGeography || null,
        teamSize: payload.teamSize || null,
        teamComposition: payload.teamComposition || null,
        gigExpertTypes: Array.isArray(payload.gigExpertTypes) ? payload.gigExpertTypes : [],
        gigExpertTypeOther: payload.gigExpertTypeOther || null,
        designOrBuild: payload.designOrBuild || null,
        projectTypes: Array.isArray(payload.projectTypes) ? payload.projectTypes : [],
        projectTypeOther: payload.projectTypeOther || null,
        keyWorkAreas: payload.keyWorkAreas || null,
        status: 'pending'
      }
    });

    // 2. Send email notification
    try {
      await sendGigExpertFeedbackEmail(record);
      console.log("📧 GigExpert feedback email sent");
    } catch (emailError) {
      console.error("⚠️ Feedback saved but email failed:", emailError.message);
    }

    return res.status(201).json(record);
  } catch (error) {
    console.error('❌ Error creating gigExpert feedback:', error);
    return res.status(500).json({ message: 'Failed to create feedback', error: error.message });
  }
};

export default controller;
