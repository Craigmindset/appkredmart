"use client";
import React from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const router = useRouter();
  const handleClose = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 relative bg-gray-100">
      <button
        aria-label="Close"
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300"
      >
        <X className="h-5 w-5 text-gray-600" />
      </button>
      <h1 className="text-3xl text-left mt-10 md:text-3xl font-bold mb-6 text-[#0F3D73]">
        Privacy Policy
      </h1>
      <h1 className="text-xl text-left md:text-3xl font-bold text-[#0F3D73]">
        Kredmart Limited
      </h1>
      <p className="mb-4 text-gray-700">
        We are committed to protecting your privacy and ensuring the security of
        your personal information. This Privacy Policy outlines how we collect,
        use, and safeguard your data when you use our website.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#0F3D73]">
        1. Information We Collect
      </h2>
      <p className="mb-2">
        <strong>1.1 Personal Information:</strong> We may collect personally
        identifiable information, including but not limited to your name, email
        address, shipping and billing addresses, phone number, and payment
        details when you make a purchase on our website.
      </p>
      <p className="mb-4">
        <strong>1.2 Non-Personal Information:</strong> We may also collect
        non-personal information, such as your IP address, browser type, and
        other anonymous data, to improve our website's performance and user
        experience.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#0F3D73]">
        2. How We Use Your Information
      </h2>
      <p className="mb-2">
        <strong>2.1 Order Processing:</strong> We use your personal information
        to process and fulfil your orders, including shipping and billing.
      </p>
      <p className="mb-2">
        <strong>2.2 Communication:</strong> We may use your email address to
        send you order updates, promotional offers, and newsletters. You can
        opt-out of marketing communications at any time.
      </p>
      <p className="mb-2">
        <strong>2.3 Customer Support:</strong> Your information helps us provide
        efficient customer support and address any inquiries or issues you may
        have.
      </p>
      <p className="mb-4">
        <strong>2.4 Analytics:</strong> We may use non-personal information for
        analytical purposes to improve our website's functionality and user
        experience.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#0F3D73]">
        3. Information Sharing
      </h2>
      <p className="mb-4">
        We do not sell, trade, or rent your personal information to third
        parties. However, we may share your information with trusted third
        parties who assist us in operating our website, conducting our business,
        or servicing you.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#0F3D73]">
        4. Security
      </h2>
      <p className="mb-4">
        We implement industry-standard security measures to protect your
        information during transmission and storage. However, no method of
        transmission over the Internet or electronic storage is 100% secure.
        Therefore, we cannot guarantee absolute security.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#0F3D73]">
        5. Cookies
      </h2>
      <p className="mb-4">
        Our website uses cookies to enhance your browsing experience. You can
        choose to disable cookies through your browser settings, but this may
        affect the functionality of certain features on our site.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#0F3D73]">
        6. Third-Party Links
      </h2>
      <p className="mb-4">
        Our website may contain links to third-party websites. We are not
        responsible for the privacy practices or content of these sites. We
        encourage you to review the privacy policies of any third-party sites
        you visit.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#0F3D73]">
        7. Children's Privacy
      </h2>
      <p className="mb-4">
        Our website is not intended for individuals under the age of 13. We do
        not knowingly collect personal information from children. If you are a
        parent or guardian and believe your child has provided us with personal
        information, please contact us, and we will promptly delete such
        information.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2 text-[#0F3D73]">
        8. Changes to this Privacy Policy
      </h2>
      <p className="mb-4">
        We reserve the right to update or modify this Privacy Policy at any
        time. Any changes will be effective immediately upon posting on our
        website. Please review this policy periodically for updates.
      </p>
    </section>
  );
}
