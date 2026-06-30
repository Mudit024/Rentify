import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBookingConfirmationEmail = async ({ to, name, carTitle, pickupDate, returnDate, totalPrice }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured — skipping email send');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"DriveEase" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Your DriveEase Booking Confirmation',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color:#4f46e5;">Booking Confirmed, ${name}!</h2>
          <p>Your booking for <strong>${carTitle}</strong> has been received.</p>
          <ul>
            <li><strong>Pickup:</strong> ${new Date(pickupDate).toDateString()}</li>
            <li><strong>Return:</strong> ${new Date(returnDate).toDateString()}</li>
            <li><strong>Total Price:</strong> $${totalPrice}</li>
          </ul>
          <p>We'll notify you once the car owner approves your booking.</p>
          <p style="color:#888;font-size:12px;">— The DriveEase Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.error(`Failed to send booking confirmation email: ${err.message}`);
  }
};
