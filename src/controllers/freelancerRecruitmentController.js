import { createCrudController } from './crudFactory.js';
import prisma from '../config/prisma.js';
import { sendFreelancerApplicationEmail } from '../config/mailer.js';

const controller = createCrudController('freelancerApplication');

// Helper to map string values to Prisma Enums safely
const mapEnum = (val, enumMap, defaultVal = null) => {
  if (!val) return defaultVal;
  return enumMap[val] || defaultVal;
};

// Override create to handle the complex multi-step form data
controller.create = async (req, res) => {
  try {
    const payload = req.body || {};

    // Map Data directly for fidelity
    const bimSoftwares = (payload.bimDetails?.softwareStack || []).join(', ');
    const equipmentOwned = payload.auditDetails?.equipmentOwned || null;
    const renderingEngines = payload.vizDetails?.renderingEngines || null;

    const record = await prisma.freelancerApplication.create({
      data: {
        // 1. Identity & Accountability
        fullName: payload.fullName || null,
        designation: payload.designation || null,
        linkedinUrl: payload.linkedinUrl || null,
        location: payload.location || null,

        // 2. Legal & Tax Identity
        legalName: payload.legalNamePan || null,
        pan: payload.personalPan || null,

        // 3. Services (Flags)
        providesBIM: payload.selectedServices?.includes('BIM') || false,
        providesAsBuiltAudit: payload.selectedServices?.includes('Audit') || false,
        providesPeerReview: payload.selectedServices?.includes('Peer') || false,
        providesBOQ: payload.selectedServices?.includes('BOQ') || false,
        provides3DRendering: payload.selectedServices?.includes('Viz') || false,

        // Specific Service Details
        bimSoftwares,
        lodCapability: payload.bimDetails?.maxLod || null,
        cdeExperience: payload.bimDetails?.cdeExperience || null,
        
        equipmentOwned,
        serviceRadius: payload.auditDetails?.serviceRadius || null,

        totalExperience: payload.peerReviewDetails?.teamExperience || null,
        specialization: payload.peerReviewDetails?.specialisation || null,

        measurementStandard: payload.boqDetails?.measurementStandards || null,
        estimationSoftware: payload.boqDetails?.estimationSoftware || null,

        renderingEngines,
        hardwareCapacity: payload.vizDetails?.hardwareCapacity || null,
        animationCapability: payload.vizDetails?.animationCapability === 'Yes',

        // 4. Evidence & Commercials
        portfolioUrl: payload.portfolioUrl || payload.portfolioLink || null,
        portfolioPdfUrl: payload.portfolioPdfUrl || payload.pdfPortfolioUrl || null,
        commercialBasis: payload.commercialBasis || null,
        baseRate: payload.baseRate ? parseFloat(payload.baseRate) : null,
        leadTime: payload.noticePeriod || null,
        availability: payload.availability || null,

        // 5. Final Declaration
        signature: payload.signatureName || payload.fullName || 'Unknown',
        declarationDate: payload.submissionDate || payload.date ? new Date(payload.submissionDate || payload.date) : new Date(),
        isVerified: false,

        // Admin
        status: 'PENDING'
      },
    });

    // Send email notification
    try {
      await sendFreelancerApplicationEmail(record);
      console.log("📧 Freelancer application email sent");
    } catch (emailError) {
      console.error("⚠️ Freelancer record created but email failed:", emailError.message);
    }

    return res.status(201).json(record);
  } catch (error) {
    console.error('❌ Detailed Error creating freelancer application:', error);
    return res.status(500).json({ 
      message: 'Failed to create freelancer application',
      error: error.message,
      details: error.code
    });
  }
};

export default controller;


