import nodemailer from 'nodemailer'

const { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST || 'smtp.gmail.com',
  port: Number(SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
})

transporter.verify((error) => {
  if (error) {
    console.error("❌ GigFactory SMTP Connection Error:", error.message);
  } else {
    console.log("✅ GigFactory SMTP Transporter is ready");
  }
});

/**
 * Specifically formatted email for GigFactory Enquiries
 */
export const sendEnquiryEmail = async (enquiryData) => {
  const { name, companyName, email, phone, message } = enquiryData;
  const adminEmail = process.env.SMTP_EMAIL;
  const isCaseStudyLead = message && message.includes("Case Study Download Interest");
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .email-container { font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #edf2f7; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: ${isCaseStudyLead ? '#3b82f6' : '#0f172a'}; color: white; padding: 32px 24px; text-align: center; }
        .content { padding: 32px; line-height: 1.6; color: #334155; background: #ffffff; }
        .field { margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
        .label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .value { font-size: 16px; color: #1e293b; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1 style="margin:0; font-size: 1.5rem;">${isCaseStudyLead ? '📚 Case Study Download' : '🚀 New Gig Enquiry'}</h1>
        </div>
        <div class="content">
          ${name ? `<div class="field"><div class="label">Contact Person</div><div class="value">${name}</div></div>` : ''}
          ${(!isCaseStudyLead && companyName) ? `<div class="field"><div class="label">Company Name</div><div class="value">${companyName}</div></div>` : ''}
          <div class="field"><div class="label">Contact Info</div><div class="value">✉️ ${email}${phone ? ` | 📞 ${phone}` : ""}</div></div>
          
          ${(message && !isCaseStudyLead) ? `
            <div class="field"><div class="label">Message</div><div class="value">${message}</div></div>
          ` : ''}
        </div>
        <div class="footer">GigFactory Admin Notification | ${new Date().toLocaleString()}</div>
      </div>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: `"GigFactory Admin" <${process.env.SMTP_EMAIL}>`,
    to: adminEmail,
    subject: isCaseStudyLead 
      ? `📚 Case Study Lead: ${name}`
      : `🚀 New Gig Enquiry from ${companyName || name}`,
    html,
  });
};

/**
 * Specifically formatted email for Agency Applications
 */
export const sendAgencyApplicationEmail = async (data) => {
  const adminEmail = process.env.SMTP_EMAIL;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: 'Inter', sans-serif; max-width: 700px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
        .header { background: #1e293b; color: white; padding: 32px; text-align: center; }
        .section { padding: 32px; border-bottom: 1px solid #f1f5f9; }
        .section-title { font-size: 14px; font-weight: 900; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .field { margin-bottom: 16px; }
        .label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 15px; font-weight: 600; color: #1e293b; }
        .tag { display: inline-block; padding: 4px 10px; background: #eff6ff; color: #1d4ed8; border-radius: 6px; font-size: 12px; font-weight: 700; margin: 2px; }
        .link-btn { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; margin-top: 10px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size: 24px;">🏢 New Agency Application</h1>
          <p style="margin:8px 0 0; opacity: 0.7;">Submitted for GigFactory Recruitment</p>
        </div>

        <div class="section">
          <div class="section-title">Identity & Accountability</div>
          <div class="grid">
            ${data.authorizedPerson ? `<div class="field"><div class="label">Authorised Person</div><div class="value">${data.authorizedPerson}</div></div>` : ''}
            ${data.designation ? `<div class="field"><div class="label">Designation</div><div class="value">${data.designation}</div></div>` : ''}
            ${data.companyName ? `<div class="field"><div class="label">Company Name</div><div class="value">${data.companyName}</div></div>` : ''}
            ${data.headquarters ? `<div class="field"><div class="label">Headquarters</div><div class="value">${data.headquarters}</div></div>` : ''}
            ${data.linkedinUrl ? `<div class="field"><div class="label">LinkedIn</div><div class="value"><a href="${data.linkedinUrl}" style="color:#3b82f6;">Profile Link</a></div></div>` : ''}
            ${data.website ? `<div class="field"><div class="label">Website</div><div class="value"><a href="${data.website}" style="color:#3b82f6;">Visit Site</a></div></div>` : ''}
          </div>
        </div>

        ${(data.gstNumber || data.pan || data.cin) ? `
          <div class="section">
            <div class="section-title">Legal & Tax Identity</div>
            <div class="grid">
              ${data.gstNumber ? `<div class="field"><div class="label">GST Number</div><div class="value" style="font-family: monospace;">${data.gstNumber}</div></div>` : ''}
              ${data.pan ? `<div class="field"><div class="label">PAN Number</div><div class="value" style="font-family: monospace;">${data.pan}</div></div>` : ''}
              ${data.cin ? `<div class="field"><div class="label">CIN Number</div><div class="value" style="font-family: monospace;">${data.cin}</div></div>` : ''}
            </div>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Technical Expertise</div>
          <div style="margin-bottom: 20px;">
            ${data.providesBIM ? '<span class="tag">BIM & Drafting</span>' : ''}
            ${data.providesAsBuiltAudit ? '<span class="tag">As-Built Audit</span>' : ''}
            ${data.providesPeerReview ? '<span class="tag">Peer Review</span>' : ''}
            ${data.providesBOQ ? '<span class="tag">BOQ & Estimation</span>' : ''}
            ${data.provides3DRendering ? '<span class="tag">3D Visualisation</span>' : ''}
          </div>
          
          ${data.providesBIM ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">BIM Details</div>
              <div class="value">${data.lodCapability ? `LOD: ${data.lodCapability} | ` : ''}Softwares: ${data.bimSoftwares || "None"}</div>
              ${data.cdeExperience ? `<div style="font-size:12px; color:#64748b; margin-top:4px;">CDE: ${data.cdeExperience}</div>` : ''}
            </div>
          ` : ''}

          ${data.providesAsBuiltAudit ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">As-Built Audit Details</div>
              ${data.serviceRadius ? `<div class="value">Radius: ${data.serviceRadius}</div>` : ''}
              ${data.equipmentOwned ? `<div style="font-size:12px; color:#64748b; margin-top:4px;">Equipment: ${data.equipmentOwned}</div>` : ''}
            </div>
          ` : ''}

          ${data.providesPeerReview ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">Peer Review Details</div>
              <div class="value">${data.specialization ? `Specialization: ${data.specialization}` : ''} ${data.totalExperience ? `| Team Exp: ${data.totalExperience}` : ''}</div>
            </div>
          ` : ''}
          
          ${data.providesBOQ ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">BOQ Details</div>
              <div class="value">${data.measurementStandard ? `Standard: ${data.measurementStandard} | ` : ''}Software: ${data.estimationSoftware || "None"}</div>
            </div>
          ` : ''}

          ${data.provides3DRendering ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">3D Visualisation Details</div>
              <div class="value">${data.hardwareCapacity ? `Hardware: ${data.hardwareCapacity} | ` : ''}Animation: ${data.animationCapability ? "Yes" : "No"}</div>
              ${data.renderingEngines ? `<div style="font-size:12px; color:#64748b; margin-top:4px;">Engines: ${data.renderingEngines}</div>` : ''}
            </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">Commercials & Portfolio</div>
          <div class="grid">
            <div class="field"><div class="label">Basis</div><div class="value">${data.commercialBasis}</div></div>
            <div class="field"><div class="label">Base Rate</div><div class="value">${data.baseRate} INR</div></div>
            <div class="field"><div class="label">Notice Period</div><div class="value">${data.leadTime}</div></div>
            <div class="field"><div class="label">Team Size</div><div class="value">${data.teamSize}</div></div>
          </div>
          <div style="margin-top: 20px;">
            ${data.portfolioUrl ? `<a href="${data.portfolioUrl}" class="link-btn">View Online Portfolio</a>` : ''}
            ${data.portfolioPdfUrl ? `<a href="${data.portfolioPdfUrl}" class="link-btn" style="background:#10b981; margin-left:10px;">Download Portfolio PDF</a>` : ''}
            ${!data.portfolioUrl && !data.portfolioPdfUrl ? '<div class="value">No portfolio attached</div>' : ''}
          </div>
        </div>

        <div class="section" style="background:#f1f5f9; border:none; text-align:center;">
           <div class="label">Digital Signature</div>
           <div style="font-family: 'Georgia', serif; font-style: italic; font-size: 24px; color: #1e293b; margin: 10px 0;">"${data.signature}"</div>
           <div class="label">Submitted On: ${new Date(data.declarationDate || data.createdAt).toDateString()}</div>
        </div>

        <div class="footer">GigFactory Recruitment Notification System</div>
      </div>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: `"GigFactory Recruitment" <${process.env.SMTP_EMAIL}>`,
    to: adminEmail,
    subject: `🏢 NEW Agency Application: ${data.companyName}`,
    html,
  });
};

/**
 * Specifically formatted email for Freelancer Applications
 */
export const sendFreelancerApplicationEmail = async (data) => {
  const adminEmail = process.env.SMTP_EMAIL;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: 'Inter', sans-serif; max-width: 700px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
        .header { background: #0f172a; color: white; padding: 32px; text-align: center; }
        .section { padding: 32px; border-bottom: 1px solid #f1f5f9; }
        .section-title { font-size: 14px; font-weight: 900; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .field { margin-bottom: 16px; }
        .label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 15px; font-weight: 600; color: #1e293b; }
        .tag { display: inline-block; padding: 4px 10px; background: #ecfdf5; color: #059669; border-radius: 6px; font-size: 12px; font-weight: 700; margin: 2px; }
        .link-btn { display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; margin-top: 10px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size: 24px;">🧑‍💻 New Freelancer Application</h1>
          <p style="margin:8px 0 0; opacity: 0.7;">New professional join request received</p>
        </div>

        <div class="section">
          <div class="section-title">Identity & Profile</div>
          <div class="grid">
            ${data.fullName ? `<div class="field"><div class="label">Full Name</div><div class="value">${data.fullName}</div></div>` : ''}
            ${data.designation ? `<div class="field"><div class="label">Designation</div><div class="value">${data.designation}</div></div>` : ''}
            ${data.location ? `<div class="field"><div class="label">Location</div><div class="value">${data.location}</div></div>` : ''}
            ${data.linkedinUrl ? `<div class="field"><div class="label">LinkedIn</div><div class="value"><a href="${data.linkedinUrl}" style="color:#10b981;">Profile Link</a></div></div>` : ''}
          </div>
        </div>

        ${(data.legalName || data.pan) ? `
          <div class="section">
            <div class="section-title">Legal & Tax</div>
            <div class="grid">
              ${data.legalName ? `<div class="field"><div class="label">Legal Name (PAN)</div><div class="value">${data.legalName}</div></div>` : ''}
              ${data.pan ? `<div class="field"><div class="label">PAN Number</div><div class="value" style="font-family: monospace;">${data.pan}</div></div>` : ''}
            </div>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Technical Expertise</div>
          <div style="margin-bottom: 20px;">
            ${data.providesBIM ? '<span class="tag">BIM & Drafting</span>' : ''}
            ${data.providesAsBuiltAudit ? '<span class="tag">As-Built Audit</span>' : ''}
            ${data.providesPeerReview ? '<span class="tag">Peer Review</span>' : ''}
            ${data.providesBOQ ? '<span class="tag">BOQ & Estimation</span>' : ''}
            ${data.provides3DRendering ? '<span class="tag">3D Visualisation</span>' : ''}
          </div>
          
          ${data.providesBIM ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">BIM Details</div>
              <div class="value">${data.lodCapability ? `LOD: ${data.lodCapability} | ` : ''}Softwares: ${data.bimSoftwares || "None"}</div>
            </div>
          ` : ''}

          ${data.providesAsBuiltAudit ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">As-Built Audit Details</div>
              ${data.serviceRadius ? `<div class="value">Radius: ${data.serviceRadius}</div>` : ''}
              ${data.equipmentOwned ? `<div style="font-size:12px; color:#64748b; margin-top:4px;">Equipment: ${data.equipmentOwned}</div>` : ''}
            </div>
          ` : ''}

          ${data.providesPeerReview ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">Peer Review Details</div>
              <div class="value">${data.specialization ? `Specialization: ${data.specialization}` : ''} ${data.totalExperience ? `| Experience: ${data.totalExperience}` : ''}</div>
            </div>
          ` : ''}

          ${data.providesBOQ ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">BOQ Details</div>
              <div class="value">${data.measurementStandard ? `Standard: ${data.measurementStandard} | ` : ''}Software: ${data.estimationSoftware || "None"}</div>
            </div>
          ` : ''}

          ${data.provides3DRendering ? `
            <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:12px;">
              <div class="label">3D Visualisation Details</div>
              <div class="value">${data.hardwareCapacity ? `Hardware: ${data.hardwareCapacity} | ` : ''}Animation: ${data.animationCapability ? "Yes" : "No"}</div>
              ${data.renderingEngines ? `<div style="font-size:12px; color:#64748b; margin-top:4px;">Engines: ${data.renderingEngines}</div>` : ''}
            </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">Commercials & Portfolio</div>
          <div class="grid">
            <div class="field"><div class="label">Basis</div><div class="value">${data.commercialBasis}</div></div>
            <div class="field"><div class="label">Base Rate</div><div class="value">${data.baseRate} INR</div></div>
            <div class="field"><div class="label">Notice Time</div><div class="value">${data.leadTime}</div></div>
            <div class="field"><div class="label">Availability</div><div class="value">${data.availability}</div></div>
          </div>
          <div style="margin-top: 20px;">
            ${data.portfolioUrl ? `<a href="${data.portfolioUrl}" class="link-btn">View Online Portfolio</a>` : ''}
            ${data.portfolioPdfUrl ? `<a href="${data.portfolioPdfUrl}" class="link-btn" style="background:#3b82f6; margin-left:10px;">Download Portfolio PDF</a>` : ''}
          </div>
        </div>

        <div class="section" style="background:#f1f5f9; border:none; text-align:center;">
           <div class="label">Professional Signature</div>
           <div style="font-family: 'Georgia', serif; font-style: italic; font-size: 24px; color: #1e293b; margin: 10px 0;">"${data.signature}"</div>
           <div class="label">Applied On: ${new Date(data.declarationDate || data.createdAt).toDateString()}</div>
        </div>

        <div class="footer">GigFactory Recruitment Notification System</div>
      </div>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: `"GigFactory Recruitment" <${process.env.SMTP_EMAIL}>`,
    to: adminEmail,
    subject: `🧑‍💻 NEW Freelancer Application: ${data.fullName}`,
    html,
  });
};

/**
 * Specifically formatted email for GigExpert Feedback
 */
export const sendGigExpertFeedbackEmail = async (data) => {
  const adminEmail = process.env.SMTP_EMAIL;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
        .header { background: #6366f1; color: white; padding: 32px; text-align: center; }
        .section { padding: 32px; border-bottom: 1px solid #f1f5f9; }
        .field { margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
        .label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 15px; font-weight: 600; color: #1e293b; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size: 24px;">🌟 New GigExpert Feedback</h1>
          <p style="margin:8px 0 0; opacity: 0.8;">New submission from professional network</p>
        </div>
        <div class="section">
          <div class="field"><div class="label">Expert Name</div><div class="value">${data.name || "N/A"}</div></div>
          
          ${data.expertType ? `
            <div class="field"><div class="label">Expert Type</div><div class="value">${data.expertType} ${data.expertTypeOther ? `(${data.expertTypeOther})` : ""}</div></div>
          ` : ''}

          ${data.experience ? `
            <div class="field"><div class="label">Experience</div><div class="value">${data.experience} Years</div></div>
          ` : ''}

          <div class="field"><div class="label">Contact Info</div><div class="value">${data.email ? `✉️ ${data.email}` : ""} ${data.phone ? ` | 📞 ${data.phone}` : ""}</div></div>
          
          ${data.location || data.workGeography ? `
            <div class="field"><div class="label">Location / Geography</div><div class="value">${data.location || "N/A"} ${data.workGeography ? `(${data.workGeography})` : ""}</div></div>
          ` : ''}

          ${data.teamSize || data.teamComposition ? `
            <div class="field"><div class="label">Team Details</div><div class="value">${data.teamSize || "Solo"} ${data.teamComposition ? `| ${data.teamComposition}` : ""}</div></div>
          ` : ''}

          ${data.gigExpertTypes?.length > 0 ? `
            <div class="field"><div class="label">Gig Types</div><div class="value">${data.gigExpertTypes.join(", ")} ${data.gigExpertTypeOther ? `(${data.gigExpertTypeOther})` : ""}</div></div>
          ` : ''}

          ${data.designOrBuild || data.projectTypes?.length > 0 ? `
            <div class="field"><div class="label">Core Activity</div><div class="value">${data.designOrBuild || ""} ${data.projectTypes?.length > 0 ? `| Projects: ${data.projectTypes.join(", ")}` : ""}</div></div>
          ` : ''}

          ${data.keyWorkAreas ? `
            <div class="field" style="border:none;"><div class="label">Key Work Areas</div><div class="value" style="font-style:italic;">"${data.keyWorkAreas}"</div></div>
          ` : ''}
        </div>
        <div class="footer">GigFactory Network System | ${new Date().toLocaleString()}</div>
      </div>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: `"GigFactory Feedback" <${process.env.SMTP_EMAIL}>`,
    to: adminEmail,
    subject: `🌟 NEW GigExpert Feedback: ${data.name}`,
    html,
  });
};

export default transporter