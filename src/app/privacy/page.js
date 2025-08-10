'use client';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800">Personal Information</h3>
                  <p>We may collect personal information that you voluntarily provide to us, such as:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Search queries and preferences</li>
                    <li>Email address (if you choose to subscribe to updates)</li>
                    <li>Device information and IP address</li>
                    <li>Usage data and analytics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Automatically Collected Information</h3>
                  <p>We automatically collect certain information when you use our service:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited and time spent</li>
                    <li>Referring website</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p>We use the collected information for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>To provide and maintain our shopping comparison service</li>
                <li>To improve and personalize your experience</li>
                <li>To analyze usage patterns and optimize our service</li>
                <li>To communicate with you about updates and features</li>
                <li>To ensure the security and integrity of our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing and Disclosure</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our service</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, your information may be transferred</li>
                <li><strong>Aggregated Data:</strong> We may share anonymized, aggregated data for research and analytics purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure hosting and infrastructure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to enhance your experience:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Third-Party Cookies:</strong> Used by our partners for analytics and advertising</li>
              </ul>
              <p className="mt-3">You can control cookie settings through your browser preferences.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Third-Party Services</h2>
              <p>Our service may integrate with third-party services and websites. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of third-party services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights and Choices</h2>
              <p>You have certain rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Data Retention</h2>
              <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
              <p>Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. International Data Transfers</h2>
              <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-2">
                Email: privacy@shoppingcomparison.com<br />
                Address: [Your Company Address]<br />
                Phone: [Your Phone Number]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 