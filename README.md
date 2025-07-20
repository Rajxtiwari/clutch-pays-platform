# 🎮 Clutch Pays - Skill-Based Gaming Platform

A modern, secure, and responsive gaming platform where players can compete in skill-based matches with real money stakes.

## ✨ Features

### 🔐 Authentication & Security
- **Email OTP Verification** - Secure account creation with email verification
- **Role-Based Access Control** - Player, Host, and Admin roles
- **Server-Side Validation** - All critical operations validated on backend
- **Secure Payment Processing** - Integrated with Cashfree Payment Gateway

### 🎯 Gaming Features
- **Match Browser** - Browse and join open matches
- **Real-Time Updates** - Live match status and leaderboards
- **Host Dashboard** - Create and manage matches (for verified hosts)
- **Leaderboards** - Top earners, win rates, and host ratings
- **Match History** - Complete match participation history

### 💰 Financial System
- **Wallet Management** - Secure deposit and withdrawal system
- **Transaction History** - Complete financial transaction tracking
- **Admin Approval** - Manual verification for deposits/withdrawals
- **Automatic Payouts** - Winners receive 90% of match pool

### 📱 Responsive Design
- **Mobile Optimized** - Perfect experience on phones and tablets
- **Desktop Ready** - Full-featured desktop interface
- **Zoom Compatible** - Works at 100%, 150%, 200%+ zoom levels
- **Cross-Browser** - Compatible with all modern browsers

### 🛡️ Admin Dashboard
- **User Management** - Verify users and manage roles
- **Transaction Approval** - Review and approve financial transactions
- **Support System** - Handle user support tickets
- **Analytics** - Platform statistics and insights

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible components
- **Framer Motion** - Smooth animations
- **React Router v7** - Client-side routing

### Backend
- **Convex** - Real-time backend and database
- **Convex Auth** - Authentication system
- **Server-side Validation** - Secure API endpoints
- **Real-time Updates** - Live data synchronization

### Payments
- **Cashfree Payment Gateway** - Secure payment processing
- **Webhook Integration** - Automatic payment verification
- **Multi-currency Support** - INR transactions

## 🏠 Local Development Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Quick Start

1. **Clone and Install**
   
   ```bash
   git clone https://github.com/Rajxtiwari/clutch-pays-platform.git
   cd clutch-pays-platform
   ```

   ```bash
   pnpm install
   ```

2. **Set up Convex**
   ```bash
   npx convex dev
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:
```env
VITE_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment_name
```

### Convex Environment Variables
Set in Convex dashboard:
```env
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret
CONVEX_SITE_URL=your_site_url
```

## 🎮 Usage

### For Players
1. **Sign Up** - Create account with email verification
2. **Verify Identity** - Upload documents for player verification
3. **Add Money** - Deposit funds to your wallet
4. **Join Matches** - Browse and join skill-based matches
5. **Compete & Win** - Play matches and earn money

### For Hosts
1. **Get Verified** - Apply for host verification
2. **Create Matches** - Set up matches with entry fees
3. **Stream Live** - Provide stream URL for transparency
4. **Declare Winners** - Fairly declare match results
5. **Build Reputation** - Maintain high host rating

### For Admins
1. **User Management** - Verify users and manage roles
2. **Transaction Control** - Approve deposits and withdrawals
3. **Support Handling** - Resolve user issues and disputes
4. **Platform Analytics** - Monitor platform health and growth

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── admin/          # Admin dashboard components
│   ├── dashboard/      # User dashboard components
│   ├── payments/       # Payment-related components
│   └── ui/             # Base UI components (shadcn)
├── convex/             # Backend functions and schema
│   ├── auth/           # Authentication providers
│   └── generators/     # Data generation scripts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## 🔒 Security Features

- **Input Validation** - All user inputs validated on server
- **Authentication Required** - Protected routes and API endpoints
- **Role-Based Access** - Different permissions for different user types
- **Financial Security** - Manual approval for all financial transactions
- **Rate Limiting** - Protection against abuse and spam
- **Secure Headers** - CORS and security headers configured

## 📱 Responsive Design

- **Mobile First** - Designed for mobile, enhanced for desktop
- **Touch Friendly** - Optimized for touch interactions
- **Flexible Layouts** - Adapts to any screen size
- **Zoom Support** - Works perfectly at high zoom levels
- **Accessibility** - WCAG compliant components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email raja20005tiwari@gmail.com or create an issue in this repository.

## 🙏 Acknowledgments

- **Convex** - For the amazing real-time backend
- **Shadcn/ui** - For beautiful, accessible components
- **Cashfree** - For secure payment processing
- **Tailwind CSS** - For utility-first styling

---

**Built with ❤️ by Rajxtiwari**

🎮 **Ready to compete? Join Clutch Pays today!** 🚀