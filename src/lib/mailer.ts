import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIl,
    pass: process.env.PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"ShopVerse BD" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};
