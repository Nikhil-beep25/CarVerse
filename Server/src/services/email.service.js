import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    if (
      env.EMAIL_HOST &&
      env.EMAIL_USER &&
      env.EMAIL_USER !== 'your_mailtrap_user'
    ) {
      transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST,
        port: parseInt(env.EMAIL_PORT || '587', 10),
        secure: parseInt(env.EMAIL_PORT || '587', 10) === 465,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      });
    }
  }
  return transporter;
};

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message body
 * @param {string} [options.html] - Optional HTML message body
 */
export const sendEmail = async (options) => {
  const mailTransporter = getTransporter();

  const messageOptions = {
    from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message.replace(/\n/g, '<br>')}</p>`,
  };

  if (!mailTransporter) {
    // In development or when email config is placeholder/omitted, log the email gracefully
    logger.info(`[Email Service Simulation] To: ${options.email} | Subject: ${options.subject}`);
    logger.debug(`[Email Body]:\n${options.message}`);
    return {
      success: true,
      simulated: true,
      message: 'Email simulated in development mode',
    };
  }

  try {
    const info = await mailTransporter.sendMail(messageOptions);
    logger.info(`[Email Sent] Message ID: ${info.messageId} to ${options.email}`);
    return info;
  } catch (err) {
    logger.warn(`[Email Send Warning] ${err.message}. Falling back to simulation mode.`);
    logger.info(`[Email Service Simulation] To: ${options.email} | Subject: ${options.subject}`);
    logger.debug(`[Email Body]:\n${options.message}`);
    return {
      success: true,
      simulated: true,
      message: 'Email simulated following transport fallback',
    };
  }
};

export default { sendEmail };
