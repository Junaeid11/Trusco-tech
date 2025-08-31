import nodemailer, { Transporter } from 'nodemailer';
import { config } from './../config';
import logger from './logger';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

class Mailer {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendMail(options: MailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: options.from || config.email.user,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', { messageId: info.messageId, to: options.to });
    } catch (error) {
      logger.error('Failed to send email', { error, to: options.to });
      throw new Error('Failed to send email');
    }
  }

  // Guest or registered order confirmation
  async sendOrderConfirmation(order: any, isGuest: boolean = false): Promise<void> {
    const subject = `Order Received — ${order.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmation</h2>
        <p>Thank you for your order!</p>

        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> $${order.grandTotal}</p>

        <h3>Items Ordered</h3>
        ${order.items
          .map(
            (item: any) => `
            <div style="border-bottom:1px solid #eee;padding:10px 0;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.qty} | Price: $${item.price}</p>
            </div>
          `
          )
          .join('')}

        ${isGuest ? `
          <h4>Cash on Delivery Instructions</h4>
          <p>Please have the exact amount ready when your order is delivered.</p>
          <p>Our delivery team will contact you at ${order.guest.phone} to confirm delivery.</p>
        ` : ''}

        <h3>Shipping Address</h3>
        <p>${order.address.street}</p>
        <p>${order.address.city}, ${order.address.region} ${order.address.postalCode}</p>
        <p>${order.address.country}</p>

        <p>If you have any questions, contact us at support@ecommerce.com</p>
      </div>
    `;

    await this.sendMail({
      to: isGuest ? order.guest.email : order.user.email,
      subject,
      html,
    });
  }

  // Admin notification for guest or registered order
  async sendAdminOrderNotification(order: any, isGuest: boolean = false): Promise<void> {
    const subject = `NEW ${isGuest ? 'GUEST ' : ''}COD Order — ${order.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">New Order Received</h2>

        <h3>Order Summary</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> $${order.grandTotal}</p>
        <p><strong>Payment Method:</strong> Cash on Delivery</p>

        <h3>Customer Information</h3>
        ${isGuest ? `
          <p><strong>Name:</strong> ${order.guest.name}</p>
          <p><strong>Email:</strong> ${order.guest.email}</p>
          <p><strong>Phone:</strong> ${order.guest.phone}</p>
        ` : `
          <p><strong>Name:</strong> ${order.user.name}</p>
          <p><strong>Email:</strong> ${order.user.email}</p>
          <p><strong>Phone:</strong> ${order.user.phone}</p>
        `}

        <h3>Shipping Address</h3>
        <p>${order.address.street}</p>
        <p>${order.address.city}, ${order.address.region} ${order.address.postalCode}</p>
        <p>${order.address.country}</p>

        <h3>Order Items</h3>
        ${order.items
          .map(
            (item: any) => `
            <div style="border-bottom:1px solid #eee;padding:10px 0;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.qty} | Price: $${item.price} | Total: $${item.total}</p>
            </div>
          `
          )
          .join('')}

        <h4>Action Required</h4>
        <p>Please contact the customer to arrange delivery and payment collection.</p>
        <p><strong>Contact Phone:</strong> ${isGuest ? order.guest.phone : order.user.phone}</p>
      </div>
    `;

    await this.sendMail({
      to: 'admin@ecommerce.com', // replace with actual admin email
      subject,
      html,
    });
  }
}

export const mailer = new Mailer();
