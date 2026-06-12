import nodemailer from "nodemailer";
import mailgen from "mailgen";

const sendEmail = async (options) => {
  // 1. Initialize Mailgen for beautiful HTML email layouts
  const mailGenerator = new mailgen({
    theme: "default",
    product: {
      name: "STUDENT-OS",
      link: "https://taskmanagerlink.com",
    },
  });

  // 2. Configure Nodemailer with Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const mail = {
    from: `"StudentOS" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (err) {
    console.error("Email service failed silently", err);
  }
};

const emailVerificationMailgenContent = (name, verifyUrl) => {
  return {
    body: {
      name: name,
      intro: "Welcome to our App! We're very excited to have you on board.",
      action: {
        instructions: "To get started with your account, please click here:",
        button: {
          color: "#22BC66",
          text: "Verify your account",
          link: verifyUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email we'd love to help.",
    },
  };
};
const forgotpassMailgenContent = (username, verifyUrl) => {
  return {
    body: {
      name: name,
      intro: "You have requested a password reset.",
      action: {
        instructions: "To reset your password, please click here:",
        button: {
          color: "#22BC66",
          text: "Reset your password",
          link: verifyUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email we'd love to help.",
    },
  };
};

// sendEmail({
//   email: "325106410020@andhrauniversity.edu.in",
//   subject: "Please Verify Your Email",
//   mailgenContent: emailVerificationMailgenContent(
//     "ramcharan",
//     "https://taskmanagerlink.com",
//   ),
// });
export { sendEmail, emailVerificationMailgenContent, forgotpassMailgenContent };
