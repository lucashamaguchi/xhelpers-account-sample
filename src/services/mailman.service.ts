import axios from "axios";

export default class MailmanService {
  endpoint: string;
  mailmanAppKey: string;
  constructor() {
    this.endpoint = process.env.MAILMAN_API_URL + "/api/mails";
    if (!this.endpoint || this.endpoint.length === 0) {
      console.log(
        "[Mailman] Send emails is disabled, environment is empty: 'MAILMAN_API_URL'"
      );
      this.endpoint = null;
      return;
    }
    this.mailmanAppKey = process.env.MAILMAN_APP_KEY;
    if (!this.mailmanAppKey || this.mailmanAppKey.length === 0) {
      console.log(
        "[Mailman] Appkey is missing, environment is empty: 'MAILMAN_APP_KEY'"
      );
      this.mailmanAppKey = null;
      return;
    }
  }

  async sendEmail(email: any, typeEmail: string, data: any) {
    if (!this.endpoint || !this.mailmanAppKey) {
      console.log(`[Mailman] is disabled - email NOT sent: ${email}`);
      return;
    }

    try {
      const response = await axios.post(
        this.endpoint,
        {
          email,
          type: typeEmail,
          data,
        },
        {
          headers: {
            appkey: this.mailmanAppKey,
          },
        }
      );
      console.log("📧  Mailman response:", response);
    } catch (error) {
      console.log("📧  Mailman error:", error.message);
    }
  }
}
