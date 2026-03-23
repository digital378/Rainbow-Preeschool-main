import { SEO } from "@/components/seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ArrowLeft } from "lucide-react";

export function TermsPage() {
  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title="Terms of Service | Rainbow Preschool International"
        description="Terms and conditions for using Rainbow Preschool International website and services."
        canonical="/terms"
        noIndex={true}
      />
      <main className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: January 2026</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Rainbow Preschool International website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Use of Website</h2>
            <p>
              This website is intended to provide information about Rainbow Preschool International's educational programmes and services. You agree to use this website only for lawful purposes and in a way that does not infringe upon the rights of others.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Accuracy</h2>
            <p>
              While we strive to provide accurate and up-to-date information, we make no warranties or representations about the accuracy, completeness, or reliability of any information on this website. Programme details, fees, and availability are subject to change without notice.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and graphics, is the property of Rainbow Preschool International and is protected by copyright laws. You may not reproduce, distribute, or use any content without our prior written permission.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Contact Information</h2>
            <p>For any questions regarding these terms, please contact us:</p>
            <div className="flex flex-col gap-2 mt-4">
              <a href="tel:+918291568972" className="flex items-center gap-2 text-primary hover:underline">
                <Phone className="h-4 w-4" />
                +91 82915 68972
              </a>
              <a href="mailto:admissions@rainbowpreschools.com" className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="h-4 w-4" />
                admissions@rainbowpreschools.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="pt-20 md:pt-24">
      <SEO
        title="Privacy Policy | Rainbow Preschool International"
        description="Privacy policy for Rainbow Preschool International website. Learn how we collect, use, and protect your personal information."
        canonical="/privacy"
        noIndex={true}
      />
      <main className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: January 2026</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p>When you submit an enquiry form on our website, we collect the following information:</p>
            <ul className="list-disc pl-6 my-4 space-y-1">
              <li>Parent/Guardian name</li>
              <li>Phone number</li>
              <li>Email address (optional)</li>
              <li>Child's name and age</li>
              <li>Preferred programme and centre location</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information you provide to:</p>
            <ul className="list-disc pl-6 my-4 space-y-1">
              <li>Respond to your enquiries about our programmes</li>
              <li>Schedule campus visits and provide admission information</li>
              <li>Send updates about our educational offerings (with your consent)</li>
              <li>Improve our website and services</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Protection</h2>
            <p>
              We take appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. Your data is stored securely and is only accessible to authorized personnel who need it to respond to your enquiries.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Cookies and Analytics</h2>
            <p>
              We use cookies and similar technologies to analyze website traffic and improve user experience. We use Google Analytics to understand how visitors interact with our website. This information is anonymized and used solely for analytical purposes.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Third-Party Services</h2>
            <p>
              We may share your information with trusted third-party services that help us operate our website and manage enquiries. These services are bound by confidentiality agreements and are not permitted to use your information for any other purpose.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 my-4 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
            <p>For any privacy-related questions or to exercise your rights, please contact us:</p>
            <div className="flex flex-col gap-2 mt-4">
              <a href="tel:+918291568972" className="flex items-center gap-2 text-primary hover:underline">
                <Phone className="h-4 w-4" />
                +91 82915 68972
              </a>
              <a href="mailto:admissions@rainbowpreschools.com" className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="h-4 w-4" />
                admissions@rainbowpreschools.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TermsPage;
