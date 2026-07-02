import nodemailer from 'nodemailer';
import 'dotenv/config';

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
      from: `" Rentify" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Your  Rentify Booking Confirmation',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color:#4f46e5;">Booking Confirmed, ${name}!</h2>
          <p>Your booking for <strong>${carTitle}</strong> has been received.</p>
          <ul>
            <li><strong>Pickup:</strong> ${new Date(pickupDate).toDateString()}</li>
            <li><strong>Return:</strong> ${new Date(returnDate).toDateString()}</li>
            <li><strong>Total Price:</strong> ₹${totalPrice}</li>
          </ul>
          <p>We'll notify you once the car owner approves your booking.</p>
          <p style="color:#888;font-size:12px;">— The  Rentify Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.error(`Failed to send booking confirmation email: ${err.message}`);
  }
};

export const sendBookingAcceptanceEmail = async ({
  to,
  name,
  car,
  owner,
  pickupDate,
  returnDate,
  totalPrice,
}) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured — skipping email send');
    return;
  }

  try {
    const carDetailsHtml = `
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="margin-top: 0; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">🚗 Vehicle Details:</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #4b5563; font-weight: 600; width: 120px;">Car:</td>
            <td style="padding: 4px 0; color: #111827;">${car.brand} ${car.model} (${car.year})</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #4b5563; font-weight: 600;">Color:</td>
            <td style="padding: 4px 0; color: #111827;">${car.color}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #4b5563; font-weight: 600;">Transmission:</td>
            <td style="padding: 4px 0; color: #111827;">${car.transmission}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #4b5563; font-weight: 600;">Fuel Type:</td>
            <td style="padding: 4px 0; color: #111827;">${car.fuelType}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #4b5563; font-weight: 600;">Location:</td>
            <td style="padding: 4px 0; color: #111827;">${car.location}</td>
          </tr>
        </table>
      </div>
    `;

    const ownerDetailsHtml = `
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="margin-top: 0; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">📞 Owner Contact Details:</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #4b5563; font-weight: 600; width: 120px;">Name:</td>
            <td style="padding: 4px 0; color: #111827;">${owner.name}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #4b5563; font-weight: 600;">Phone:</td>
            <td style="padding: 4px 0; color: #111827;">${owner.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #4b5563; font-weight: 600;">Email:</td>
            <td style="padding: 4px 0; color: #111827;">${owner.email || 'N/A'}</td>
          </tr>
        </table>
      </div>
    `;

    const rulesHtml = `
      <div style="border-left: 4px solid #ef4444; background-color: #fef2f2; padding: 15px; border-radius: 0 8px 8px 0; margin: 15px 0;">
        <h4 style="margin-top: 0; color: #991b1b;">⚠️ Important Notice:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #7f1d1d; line-height: 1.5;">
          <li><strong>Driving License (DL) is MANDATORY:</strong> You must present your original, valid physical Driving License at the time of car pickup.</li>
          <li>For other rules and guidelines, please refer to the booking rules page on the Rentify website.</li>
        </ul>
      </div>
    `;

    await transporter.sendMail({
      from: `"Rentify" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Your Booking is Successful! - Rentify',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e5e7eb; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 40px;">🎉</span>
            <h2 style="color: #10b981; margin-top: 10px; margin-bottom: 5px;">Booking Successful!</h2>
            <p style="color: #6b7280; margin-top: 0;">The owner has accepted your booking request.</p>
          </div>
          
          <p>Hi <strong>${name}</strong>,</p>
          <p>Great news! Your booking for <strong>${car.title}</strong> has been successfully accepted by the owner. Here are the booking details:</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px;">
            <p style="margin: 4px 0;"><strong>Pickup Date:</strong> ${new Date(pickupDate).toDateString()}</p>
            <p style="margin: 4px 0;"><strong>Return Date:</strong> ${new Date(returnDate).toDateString()}</p>
            <p style="margin: 4px 0;"><strong>Total Cost:</strong> ₹${totalPrice}</p>
          </div>

          ${carDetailsHtml}

          ${ownerDetailsHtml}

          ${rulesHtml}

          <p style="margin-top: 20px;">Please contact the owner if you have any questions before pickup.</p>
          <p style="color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 25px;">
            Thank you for choosing Rentify!<br/>
            — The Rentify Team
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error(`Failed to send booking confirmation acceptance email: ${err.message}`);
  }
};

export const sendBookingCancellationByOwnerEmail = async ({
  to,
  name,
  carTitle,
  pickupDate,
  returnDate,
}) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured — skipping email send');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Rentify" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Important: Your Rentify Booking has been Cancelled',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e5e7eb; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 40px;">⚠️</span>
            <h2 style="color: #ef4444; margin-top: 10px; margin-bottom: 5px;">Booking Cancelled</h2>
            <p style="color: #6b7280; margin-top: 0;">Notice of cancellation by car owner.</p>
          </div>
          
          <p>Hi <strong>${name}</strong>,</p>
          <p>We are very sorry to inform you that your booking for <strong>${carTitle}</strong> (from <strong>${new Date(pickupDate).toDateString()}</strong> to <strong>${new Date(returnDate).toDateString()}</strong>) has been cancelled by the car owner.</p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 14px; color: #991b1b; line-height: 1.5;">
            <strong>Notice:</strong> We sincerely apologize for this cancellation. During pre-booking, unexpected issues can arise with the vehicle, forcing the owner to withdraw the listing. No charges have been made for this booking.
          </div>

          <p>Please browse other available cars on the platform to book your next trip. We apologize for any inconvenience caused.</p>
          
          <p style="color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 25px;">
            Thank you for your understanding,<br/>
            — The Rentify Team
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error(`Failed to send booking cancellation email: ${err.message}`);
  }
};

