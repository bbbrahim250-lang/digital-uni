import 'server-only';

import nodemailer from 'nodemailer';

export type TransactionalEmailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

type TransactionalEmail = {
  to: string[];
  cc?: string[];
  replyTo?: string;
  subject: string;
  text: string;
  attachments?: TransactionalEmailAttachment[];
  idempotencyKey?: string;
  messageId?: string;
};

export type TransactionalEmailResult = {
  configured: boolean;
  accepted: boolean;
  provider?: 'resend' | 'smtp';
};

function getConfiguration() {
  const apiKey = process.env.EMAIL_SERVICE_API_KEY ?? process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? '465');
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM_ADDRESS ?? smtpUser;

  return {
    apiKey,
    from,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPassword,
    resendConfigured: Boolean(apiKey && from),
    smtpConfigured: Boolean(
      smtpHost && Number.isInteger(smtpPort) && smtpPort > 0 && smtpUser && smtpPassword && from
    )
  };
}

export function isTransactionalEmailConfigured() {
  const configuration = getConfiguration();
  return configuration.resendConfigured || configuration.smtpConfigured;
}

export async function sendTransactionalEmail(email: TransactionalEmail): Promise<TransactionalEmailResult> {
  const configuration = getConfiguration();
  const recipients = [...new Set([...email.to, ...(email.cc ?? [])])];

  if (!configuration.resendConfigured && !configuration.smtpConfigured) {
    return { configured: false, accepted: false };
  }

  if (configuration.resendConfigured) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${configuration.apiKey}`,
          'Content-Type': 'application/json',
          ...(email.idempotencyKey ? { 'Idempotency-Key': email.idempotencyKey } : {})
        },
        body: JSON.stringify({
          from: configuration.from,
          to: email.to,
          ...(email.cc?.length ? { cc: email.cc } : {}),
          ...(email.replyTo ? { reply_to: email.replyTo } : {}),
          subject: email.subject,
          text: email.text,
          ...(email.attachments?.length
            ? {
                attachments: email.attachments.map(attachment => ({
                  filename: attachment.filename,
                  content: attachment.content.toString('base64'),
                  content_type: attachment.contentType
                }))
              }
            : {})
        }),
        cache: 'no-store'
      });

      if (response.ok) {
        const accepted = (await response.json()) as { id?: string };
        if (accepted.id) return { configured: true, accepted: true, provider: 'resend' };
      } else {
        console.error('transactional_email_resend_rejected', { status: response.status });
      }
    } catch (error) {
      console.error('transactional_email_resend_failed', {
        error: error instanceof Error ? error.name : 'unknown_error'
      });
    }
  }

  if (configuration.smtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: configuration.smtpHost,
        port: configuration.smtpPort,
        secure: process.env.SMTP_SECURE !== 'false',
        auth: { user: configuration.smtpUser, pass: configuration.smtpPassword },
        requireTLS: configuration.smtpPort !== 465,
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 30_000,
        tls: { minVersion: 'TLSv1.2' }
      });
      const delivery = await transporter.sendMail({
        from: configuration.from,
        to: email.to,
        cc: email.cc,
        replyTo: email.replyTo,
        subject: email.subject,
        text: email.text,
        messageId: email.messageId,
        attachments: email.attachments
      });
      const acceptedRecipients = new Set(delivery.accepted.map(recipient => String(recipient).toLowerCase()));
      const allRecipientsAccepted = recipients.every(recipient => acceptedRecipients.has(recipient.toLowerCase()));

      return {
        configured: true,
        accepted: allRecipientsAccepted && delivery.rejected.length === 0,
        provider: 'smtp'
      };
    } catch (error) {
      console.error('transactional_email_smtp_failed', {
        error: error instanceof Error ? error.name : 'unknown_error'
      });
    }
  }

  return { configured: true, accepted: false };
}
