import { transporter } from "./config/mailer.js";

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"snackify Dev" <${process.env.SMTP_USER}>`,
      to: "your-email@example.com", // you can use any email, ethereal will catch it
      subject: "Test Email from snackify",
      text: "this is my test email!"
    });

    console.log("email sent! preview url:", info.messageId, info.previewURL);
  } catch (err) {
    console.error("error sending test email:", err);
  }
}

sendTestEmail();
