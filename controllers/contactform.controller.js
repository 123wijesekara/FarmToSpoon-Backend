import sendEmail from "../config/sendEmail.js";
import contactModel from "../models/contact.model.js";
 

export const contactFormHandler = async (req, res) => {
  try {
    const { name, email, feedback, issue } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

  
    await contactModel.create({ name, email, feedback, issue });

    const html = `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Feedback:</strong> ${feedback || "General Feedback"}</p>
      <p><strong>Issue:</strong> ${issue}</p>
    `;

    
    await sendEmail({
      sendTo: process.env.DEFAULT_EMAIL_TO,
      subject: `Contact Form: ${feedback || "Feedback"}`,
      html
    });

    return res.status(200).json({ success: true, message: "Feedback sent successfully!" });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
