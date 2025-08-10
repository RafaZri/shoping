'use client';
import Link from 'next/link';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using this shopping comparison service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>Our service provides price comparison and product information across multiple retailers. We aggregate product data from various sources to help users find the best prices and deals available online.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate and complete information when using our service</li>
                <li>You are responsible for maintaining the confidentiality of any account information</li>
                <li>You agree not to use the service for any unlawful purpose or in any way that could damage or impair the service</li>
                <li>You must not attempt to gain unauthorized access to our systems or networks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Collection and Privacy</h2>
              <p>We collect and process information as described in our Privacy Policy. By using our service, you consent to such processing and warrant that all data provided by you is accurate.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Third-Party Links and Services</h2>
              <p>Our service may contain links to third-party websites and services. We are not responsible for the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by the use of such third-party websites or services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Disclaimers</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>The information provided on our service is for general informational purposes only</li>
                <li>We do not guarantee the accuracy, completeness, or usefulness of any information</li>
                <li>Prices and availability are subject to change without notice</li>
                <li>We are not responsible for any transactions made on third-party websites</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p>In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Intellectual Property</h2>
              <p>The service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors. The service is protected by copyright, trademark, and other laws.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h2>
              <p>We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
              <p>These Terms shall be interpreted and governed by the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Information</h2>
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
              <p className="mt-2">
                Email: legal@shoppingcomparison.com<br />
                Address: [Your Company Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 