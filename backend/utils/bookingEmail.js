import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const OWNER_EMAIL = (process.env.ADMIN_EMAIL || "kishafilmmakers.lmt@gmail.com").trim();
const FROM_EMAIL = (process.env.BOOKING_FROM_EMAIL || process.env.EMAIL_USER || OWNER_EMAIL).trim();

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn("Email transport not configured: missing EMAIL_USER/EMAIL_PASSWORD.");
    return null;
  }

  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
  });
};

const buildDetailsRows = (bookingType, booking) => {
  const rows = [];
  const addRow = (label, value) => {
    if (value) {
      rows.push(
        `<tr><td style="padding:6px 10px;font-weight:600;">${label}</td><td style="padding:6px 10px;">${value}</td></tr>`
      );
    }
  };

  addRow("Booking Type", bookingType);
  addRow("Customer Name", booking.customerName || booking.parentName || booking.girlName);
  addRow("Bride Name", booking.brideName);
  addRow("Groom Name", booking.groomName);
  addRow("Child Name", booking.childName);
  addRow("Phone", booking.phone);
  addRow("Email", booking.email);
  addRow("Event Date", booking.eventDate);
  addRow("Booking Date", booking.bookingDate);
  addRow("Reception Date", booking.receptionDate);
  addRow("Location", booking.location);
  addRow("Package", booking.package);
  addRow("Theme", booking.theme);
  addRow("Outfit Change", booking.outfitChange);
  addRow("Notes", booking.notes);

  return rows.join("");
};

export const sendBookingEmails = async ({ bookingType, booking }) => {
  const transporter = createTransporter();
  if (!transporter) return;

  const userEmail = booking.email;
  const detailsRows = buildDetailsRows(bookingType, booking);
  const detailsTable = `
    <table style="border-collapse:collapse;width:100%;max-width:620px;border:1px solid #e5e7eb;">
      <tbody>${detailsRows}</tbody>
    </table>
  `;

  const adminMail = {
    from: `"Studio KFM" <${FROM_EMAIL}>`,
    to: OWNER_EMAIL,
    subject: `New ${bookingType} booking received`,
    html: `
      <div>
        <h2>New ${bookingType} Booking</h2>
        <p>A new booking has been submitted. Details:</p>
        ${detailsTable}
      </div>
    `
  };

  const userMail = {
    from: `"Studio KFM" <${FROM_EMAIL}>`,
    to: userEmail,
    subject: `Your ${bookingType} booking is received`,
    html: `
      <div>
        <h2>Thanks for your booking!</h2>
        <p>We have received your booking request. Here is a summary:</p>
        ${detailsTable}
        <p>We will contact you soon with the next steps.</p>
      </div>
    `
  };

  const sendTasks = [];
  if (OWNER_EMAIL) sendTasks.push(transporter.sendMail(adminMail));
  if (userEmail) sendTasks.push(transporter.sendMail(userMail));

  const results = await Promise.allSettled(sendTasks);
  const failed = results.find((result) => result.status === "rejected");
  if (failed) {
    console.error("Booking email failed:", failed.reason);
  }
};
