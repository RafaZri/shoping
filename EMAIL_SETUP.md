# Email Setup Instructions

## 🚀 **For Production (Recommended)**

### **Option 1: Business Email Domain**
When you have your own domain (e.g., `yourdomain.com`):
```
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your-email-password
```

### **Option 2: Professional Email Services**
- **SendGrid** (Recommended for production)
- **Mailgun**
- **AWS SES**
- **Resend**

## 📧 **For Development/Testing**

### **Using Yahoo Email (jawherbuz@yahoo.com)**

1. **Enable 2-Factor Authentication** on your Yahoo account
2. **Generate App Password**:
   - Go to Yahoo Account Security
   - Find "App passwords"
   - Generate a new app password for "Mail"
3. **Create .env.local file**:
   ```bash
   EMAIL_USER=jawherbuz@yahoo.com
   EMAIL_PASSWORD=your-yahoo-app-password
   JWT_SECRET=your-secret-key-here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

### **Using Gmail**
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use:
   ```bash
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ```

## 🔄 **Switch to Real Email Service**

To use real email sending instead of development mode:

1. **Update imports** in these files:
   - `src/app/api/auth/signup/route.js`
   - `src/app/api/auth/forgot-password/route.js`

2. **Change from**:
   ```javascript
   import { sendVerificationEmail } from '../../../utils/emailServiceDev';
   ```

3. **Change to**:
   ```javascript
   import { sendVerificationEmail } from '../../../utils/emailService';
   ```

## 📋 **Current Status**
- ✅ Development mode active (logs emails to console)
- ✅ No email configuration required for testing
- ✅ All email functionality works without setup
- ✅ Ready to switch to real email when needed

## 🎯 **Next Steps**
1. Test the application with development email
2. Set up Yahoo app password when ready
3. Switch to real email service for production
4. Consider professional email service for business 