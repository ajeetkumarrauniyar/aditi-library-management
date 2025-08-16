import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!resend) {
  throw new Error("RESEND_API_KEY is not set");
}

export default resend;
