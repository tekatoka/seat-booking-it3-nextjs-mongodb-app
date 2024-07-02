import nodemailer from 'nodemailer';

// Define the type for the nodemailer configuration based on its usage
interface NodemailerConfig {
  host?: string;
  port?: number;
  secure?: boolean; // true for 465, false for other ports
  auth?: {
    user: string;
    pass: string;
  };
}

// This extracts the environment variable and tries to parse it safely
const nodemailerConfig: NodemailerConfig = process.env.NODEMAILER_CONFIG
  ? JSON.parse(process.env.NODEMAILER_CONFIG)
  : {};

const transporter = nodemailer.createTransport(nodemailerConfig);

interface SendMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Send email function with structured parameters
export async function sendMail({
  from,
  to,
  subject,
  html,
}: SendMailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Could not send email: ${e.message}`);
    } else {
      throw new Error('Could not send email due to an unknown error');
    }
  }
}

export const CONFIG = {
  // Ensure that the 'from' field is using the correct part of the configuration
  from: nodemailerConfig.auth?.user,
};
