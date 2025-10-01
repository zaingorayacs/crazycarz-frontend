import VerificationEmail from './VerificationEmail';
import { Resend } from 'resend';




const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email,
  username,
  VerificationCode
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Verification Code',
      react: VerificationEmail({ username, otp: VerificationCode })
    });

    if (error) {
      console.error("Error sending email:", error); // Log the error
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    console.log("Email sent successfully:", data); // Log success response
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error); // Log any unexpected errors
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
