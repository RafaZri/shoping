// Development email service - logs emails instead of sending them
// Use this for testing without email configuration

export const sendVerificationEmail = async (email, verificationToken, firstName) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  
  console.log('📧 VERIFICATION EMAIL (Development Mode):');
  console.log('To:', email);
  console.log('Subject: Verify Your Email - PriceCompare');
  console.log('Verification URL:', verificationUrl);
  console.log('---');
  
  return { success: true, messageId: 'dev-' + Date.now() };
};

export const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  console.log('📧 PASSWORD RESET EMAIL (Development Mode):');
  console.log('To:', email);
  console.log('Subject: Reset Your Password - PriceCompare');
  console.log('Reset URL:', resetUrl);
  console.log('---');
  
  return { success: true, messageId: 'dev-' + Date.now() };
}; 