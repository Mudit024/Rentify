import axios from 'axios';
import dns from 'dns';

/**
 * Validates an email address using Abstract API with a local DNS/Regex fallback.
 * Checks syntax, domain MX records, disposable email status, and SMTP deliverability.
 * 
 * @param {string} email The email address to validate.
 * @returns {Promise<boolean>} Resolves to true if the email is valid, false otherwise.
 */
export const validateEmail = async (email) => {
  const apiKey = process.env.ABSTRACT_EMAIL_VALIDATOR_KEY;
  
  // Clean email input
  const cleanEmail = email.trim().toLowerCase();

  // Basic syntax check first
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(cleanEmail)) {
    return false;
  }

  // 1. If API Key is present, call Abstract API (Option 3)
  if (apiKey) {
    try {
      const response = await axios.get('https://emailvalidation.abstractapi.com/v1/', {
        params: {
          api_key: apiKey,
          email: cleanEmail
        },
        timeout: 4000 // 4 seconds timeout limit so it doesn't hang the registration request
      });

      const data = response.data;
      
      // Abstract API checks:
      // - deliverability must be DELIVERABLE (or not UNDELIVERABLE)
      // - is_valid_format must be true
      // - is_disposable_email must be false
      // - is_smtp_valid must be true (tells if mailbox exists)
      const isFormatValid = data.is_valid_format?.value === true;
      const isNotDisposable = data.is_disposable_email?.value !== true;
      const isDeliverable = data.deliverability === 'DELIVERABLE' || data.is_smtp_valid?.value === true;

      return isFormatValid && isNotDisposable && isDeliverable;
    } catch (error) {
      console.warn("Abstract API validation failed, falling back to local verification:", error.message);
      // If API fails (rate limits, timeout), fallback to local DNS check so registration doesn't break
    }
  }

  // 2. Local fallback: Check MX record of domain
  return new Promise((resolve) => {
    const domain = cleanEmail.split('@')[1];
    if (!domain) return resolve(false);

    // Common domains fast-track
    const allowedTestDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "example.com", "test.com"];
    if (allowedTestDomains.includes(domain)) {
      return resolve(true);
    }

    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
