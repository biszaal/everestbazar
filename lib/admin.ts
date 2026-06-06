/* EverestBazar — admin gate (mock).
   Real check is a Cognito group / ADMIN env. For the demo, sign in with one of
   these phones (OTP 123456) to access /admin/kyc. */

export const ADMIN_PHONES = ["+9779800000000"];

export function isAdmin(phone: string | undefined | null): boolean {
  return !!phone && ADMIN_PHONES.includes(phone);
}

export interface KycApplication {
  id: string;
  name: string;
  phone: string;
  submittedAt: string;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const PENDING_KYC: KycApplication[] = [
  { id: "k-01", name: "Pratima Karki", phone: "+9779841002233", submittedAt: hoursAgo(2) },
  { id: "k-02", name: "Bishal Gautam", phone: "+9779802887761", submittedAt: hoursAgo(5) },
  { id: "k-03", name: "Sneha Tuladhar", phone: "+9779860445512", submittedAt: hoursAgo(9) },
];
