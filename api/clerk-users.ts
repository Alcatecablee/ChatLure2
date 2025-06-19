import { Clerk } from '@clerk/clerk-sdk-node';

// Initialize Clerk with your secret key
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication (you should implement proper auth middleware)
    // This is a basic example - you should add proper authentication checks
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the list of users from Clerk
    const users = await clerk.users.getUserList({
      limit: 100, // Adjust as needed
      orderBy: '-created_at', // Sort by creation date, newest first
    });

    // Map the users to include only necessary fields
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      publicMetadata: user.publicMetadata,
    }));

    return res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
} 