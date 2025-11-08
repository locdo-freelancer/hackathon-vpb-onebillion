import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "One Billion - Smart Banking Platform",
  description: "Secure banking platform for VPBank Hackathon",
};

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Font Awesome */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
