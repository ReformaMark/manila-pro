"use server";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifySid = process.env.TWILIO_VERIFY_SID!; // Your Twilio Verify service SID

const client = twilio(accountSid, authToken);

// use it when there is no verify service created yet in the
export async function createVerifyServiceAction() {
  try {
    const service = await client.verify.v2.services.create({
      friendlyName: "My Verify Service",
    });

    return {
      success: true,
      sid: service.sid,
    };
  } catch (err) {
    console.error("Error creating Verify service:", err);
    return {
      success: false,
      error: "Failed to create Verify service",
    };
  }
}

export async function sendOtpAction(to: string) {
  const formattedTo = to.startsWith("0")
    ? `+63${to.slice(1)}`
    : to.startsWith("+63")
      ? to
      : `+63${to}`;
  try {
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({
        to: formattedTo,
        channel: "sms",
      });

    return {
      success: true,
      sid: verification.sid,
      status: verification.status,
    };
  } catch (err) {
    console.error("Error sending OTP:", err);
    return {
      success: false,
      error: "Failed to send OTP",
    };
  }
}

export async function verifyOtpAction(to: string, code: string) {
  const formattedTo = to.startsWith("0")
    ? `+63${to.slice(1)}`
    : to.startsWith("+63")
      ? to
      : `+63${to}`;
  try {
    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: formattedTo, code });

    return {
      success: verificationCheck.status === "approved",
      status: verificationCheck.status,
    };
  } catch (err) {
    console.error("OTP verification failed:", err);
    return { success: false, error: "OTP verification failed" };
  }
}
