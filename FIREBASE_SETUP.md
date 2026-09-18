# Firebase Setup Guide

This document provides instructions for configuring and deploying the Firebase-powered lead management system.

## Firebase Configuration Already Complete

✅ Firebase project created: **codeidea-course**
✅ Firebase Authentication enabled with Email/Password provider
✅ Admin user created: `codeidea2024@gmail.com` (UID: `oBHwBrAionRUW1nHWrcLVxAr0N33`)
✅ Cloud Firestore created (Standard edition, Production mode, location: nam5)

## Required Setup Steps

### 1. Configure Environment Variables

You need to add your Firebase Web App configuration to `.env.local`:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **codeidea-course**
3. Go to **Project Settings** (gear icon) → **General**
4. Scroll down to **Your apps** section
5. Find your web app (nickname: **codeidea-course**)
6. Click on **SDK setup and configuration**
7. Select **Config** option
8. Copy the configuration values

Update `.env.local` with the actual values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=codeidea-course.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=codeidea-course
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=codeidea-course.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id_here
```

### 2. Deploy Firestore Security Rules

The security rules are defined in `firestore.rules`. Deploy them to Firebase:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in the project (if not done)
firebase init firestore

# When prompted:
# - Select "Use an existing project"
# - Choose "codeidea-course"
# - Accept default for Firestore rules file (firestore.rules)
# - Accept default for Firestore indexes file

# Deploy the rules
firebase deploy --only firestore:rules
```

**Important:** The current Firestore rules deny all access. After deploying the new rules from `firestore.rules`, the system will work as intended.

### 3. Verify Firestore Database

Make sure you're using the correct Firestore database:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **codeidea-course**
3. Go to **Firestore Database**
4. Verify the database exists (should be `(default)` database)

The system is configured to use the default Firestore database.

## System Architecture

### Data Flow

```
Public Website Form
        ↓
  Firestore Write (Public)
        ↓
  leads/{documentId}
        ↓
Admin Dashboard (Protected)
        ↓
Real-time Updates (onSnapshot)
        ↓
Status Management
```

### Firestore Collection Structure

**Collection:** `leads`

**Document Structure:**
```typescript
{
  id: string;              // Auto-generated document ID
  name: string;            // Full name from form
  email: string;           // Email address
  whatsapp: string;        // WhatsApp number
  interest: string;        // Area of interest
  createdAt: Timestamp;    // Server timestamp
  status: LeadStatus;      // "new" | "contacted" | "meeting" | "proposal" | "won" | "lost"
}
```

### Security Rules Summary

- **Public users:** Can only CREATE leads with validated structure
- **Admin user (UID: oBHwBrAionRUW1nHWrcLVxAr0N33):** Can READ, UPDATE, DELETE all leads
- **Status updates:** Only the `status` field can be updated
- **All other collections:** Denied by default

## Running the Application

### Development

```bash
npm run dev
```

Visit:
- Main website: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Login: `http://localhost:3000/dashboard/login`

### Production Build

```bash
npm run build
npm start
```

## Testing the System

### Test Form Submission

1. Visit `http://localhost:3000`
2. Fill out the Early Access form
3. Submit the form
4. Check Firestore Console to verify the lead was created

### Test Dashboard Access

1. Visit `http://localhost:3000/dashboard`
2. You should be redirected to login
3. Login with: `codeidea2024@gmail.com`
4. After authentication, you should see the dashboard
5. The submitted lead should appear in the table
6. Click "View" to see lead details
7. Change the status and verify it updates

### Test Real-time Updates

1. Keep the dashboard open
2. In another browser/tab, submit the form
3. The new lead should appear in the dashboard automatically (no refresh needed)

### Test Security

1. Logout from dashboard
2. Try to access `/dashboard` directly → Should redirect to login
3. Try wrong credentials → Should show error
4. Only the authorized admin email can access the dashboard

## Dashboard Features

### Lead Management

- **Total Leads:** Shows count of all submissions
- **New Leads:** Shows count of leads with status "new"
- **Lead Table:** Displays all leads with:
  - Name, Email, WhatsApp, Interest
  - Submission date
  - Current status with color coding
  - View button
- **Real-time Updates:** New submissions appear automatically
- **Lead Details Modal:** Shows all lead information
- **Status Management:** Update lead status with one click

### Status Options

1. **new** (blue) - Initial status for all submissions
2. **contacted** (purple) - After initial contact
3. **meeting** (orange) - Meeting scheduled/completed
4. **proposal** (green) - Proposal sent
5. **won** (light green) - Successfully converted
6. **lost** (red) - Not converted

## Troubleshooting

### Form submission fails

- Check browser console for errors
- Verify Firebase configuration in `.env.local`
- Check Firestore rules are deployed
- Ensure Firestore database exists

### Dashboard shows "Failed to load leads"

- Verify you're logged in as the admin user
- Check browser console for errors
- Verify Firestore rules allow admin UID to read
- Check Firebase Authentication is working

### Status update fails

- Verify Firestore rules allow status updates
- Check browser console for errors
- Ensure you're authenticated as admin

### Authentication errors

- Verify admin user exists in Firebase Authentication
- Check UID matches: `oBHwBrAionRUW1nHWrcLVxAr0N33`
- Verify Firebase Auth configuration is correct

## Future Expansion

This system is designed to grow into a Proposal/CRM system. The current architecture supports:

- Stable document IDs for future relationships
- Status tracking for workflow management
- Real-time updates for collaborative work
- Secure role-based access control

### Planned Extensions

```
Lead → Client → Proposal → Project
```

The `leads` collection will remain separate, allowing conversion to clients while preserving the lead history.

## Important Notes

- **Do NOT** commit `.env.local` to git (it's in .gitignore)
- **Do NOT** share Firebase configuration publicly
- **Do NOT** modify the admin UID in code
- **Do NOT** use Realtime Database (system uses Cloud Firestore)
- **Do NOT** create additional admin users without updating security rules

## Support

For issues or questions, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
