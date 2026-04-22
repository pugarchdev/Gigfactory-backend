import transporter, { sendEnquiryEmail } from '../config/mailer.js'
import prisma from '../config/prisma.js'

export const sendEnquiry = async (req, res) => {
  const { name, companyName, email, phone, message } = req.body

  if (!email || !message) {
    return res.status(400).json({ message: 'email and message are required' })
  }

  try {
    // 1. Save Enquiry to Database
    await prisma.enquiry.create({
      data: {
        name: name || null,
        companyName: companyName || null,
        email,
        phone: phone || null,
        message,
      },
    })

    // 2. Send Professional Branded Email to Admin
    try {
      await sendEnquiryEmail({
        name,
        companyName,
        email,
        phone,
        message
      });
      console.log("📧 GigFactory Enquiry email sent successfully");
    } catch (emailError) {
      console.error("⚠️ Enquiry saved but email notification failed:", emailError.message);
      // We don't fail the request if just the email fails
    }

    res.json({ message: 'Enquiry submitted successfully' })
  } catch (error) {
    console.error("❌ Failed to process enquiry:", error);
    res.status(500).json({ message: 'Failed to process enquiry' })
  }
}

export const listEnquiries = async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(enquiries);
  } catch (error) {
    console.error("❌ Failed to list enquiries:", error);
    res.status(500).json({ message: 'Failed to fetch enquiries' });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.enquiry.delete({ where: { id } });
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error("❌ Failed to delete enquiry:", error);
    res.status(500).json({ message: 'Failed to delete enquiry' });
  }
};