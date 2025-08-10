# OpenAI API Setup Guide

## 🚀 How to Set Up OpenAI API for Your Shopping Application

### Step 1: Get Your OpenAI API Key

1. **Visit OpenAI Platform**
   - Go to [https://platform.openai.com/](https://platform.openai.com/)
   - Sign up or log in to your account

2. **Create API Key**
   - Navigate to "API Keys" in the left sidebar
   - Click "Create new secret key"
   - Give it a name (e.g., "Shopping App")
   - Copy the generated key (it starts with `sk-`)

### Step 2: Configure Your Application

1. **Create Environment File**
   - In your project root directory, create a file named `.env.local`
   - Add your API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

2. **Restart Your Application**
   ```bash
   npm run dev
   ```

### Step 3: Test Your Setup

1. **Open your application** at http://localhost:3000
2. **Try searching for a product** (e.g., "laptop", "shoes")
3. **Check the AI response** - it should now provide detailed analysis

### 🔧 Features You'll Get

With OpenAI GPT-5, your application will provide:
- ✅ **Detailed product analysis** in 4 points
- ✅ **Technical descriptions**
- ✅ **Advantages and disadvantages**
- ✅ **Market comparisons**
- ✅ **Smart product recommendations**
- ✅ **Multilingual support** (French/English)

### 💰 Cost Information

- OpenAI charges per API call
- GPT-5 is more expensive than GPT-4 or GPT-3.5
- Typical cost: ~$0.01-0.05 per search
- You can set usage limits in your OpenAI dashboard

### 🛠️ Troubleshooting

**If you get "Failed to fetch" error:**
1. Check that your API key is correct
2. Ensure the `.env.local` file is in the project root
3. Restart the development server
4. Check your OpenAI account for any billing issues

**If you get rate limit errors:**
- Wait a few minutes and try again
- Check your OpenAI usage dashboard
- Consider upgrading your OpenAI plan

### 🔒 Security Notes

- Never commit your `.env.local` file to git
- Keep your API key private
- Consider using environment variables in production

---

**Your shopping application is now powered by OpenAI GPT-5! 🎉** 