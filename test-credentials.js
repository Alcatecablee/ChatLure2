// Simple test to verify credentials API transformation
async function testCredentials() {
  try {
    const response = await fetch("http://localhost:8080/api/credentials");
    const credentialsArray = await response.json();

    console.log("Raw API response:", JSON.stringify(credentialsArray, null, 2));

    // Simulate the transformation logic from api-client.ts
    const credentials = {
      reddit: {
        clientId: "",
        clientSecret: "",
        userAgent: "ChatLure:v1.0",
        enabled: false,
      },
      clerk: {
        publishableKey: "",
        secretKey: "",
        webhookSecret: "",
        enabled: false,
      },
      paypal: {
        clientId: "",
        clientSecret: "",
        planId: "",
        environment: "sandbox",
        enabled: false,
      },
    };

    // Populate with actual data from API
    credentialsArray.forEach((cred) => {
      if (cred.service === "reddit") {
        credentials.reddit = {
          ...credentials.reddit,
          ...cred.credentials,
          enabled: !!cred.isActive,
        };
      } else if (cred.service === "clerk") {
        credentials.clerk = {
          ...credentials.clerk,
          ...cred.credentials,
          enabled: !!cred.isActive,
        };
      } else if (cred.service === "paypal") {
        credentials.paypal = {
          ...credentials.paypal,
          ...cred.credentials,
          enabled: !!cred.isActive,
        };
      }
    });

    console.log(
      "\nTransformed credentials:",
      JSON.stringify(credentials, null, 2),
    );

    // Test the safe access patterns
    console.log("\nSafe access tests:");
    console.log("Reddit enabled:", credentials?.reddit?.enabled);
    console.log("Clerk enabled:", credentials?.clerk?.enabled);
    console.log("PayPal enabled:", credentials?.paypal?.enabled);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testCredentials();
