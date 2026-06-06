import type { Metadata } from "next";
import { AppFrame } from "@/components/layout/AppFrame";
import { OwnProfile } from "@/components/profile/OwnProfile";

export const metadata: Metadata = {
  title: "Your profile",
  robots: { index: false },
};

export default function ProfilePage() {
  return (
    <AppFrame>
      <OwnProfile />
    </AppFrame>
  );
}
