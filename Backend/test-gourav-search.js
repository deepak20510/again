import client from "./src/db.js";

async function testGouravSearch() {
  try {
    console.log("🔍 Testing Gourav search...\n");

    // Simulate the discovery search query
    const searchTerm = "Gourav";
    const targetRole = "TRAINER";
    const currentUserId = "test-user-id"; // Replace with actual user ID if needed

    const userWhere = {
      isActive: true,
      isBanned: false,
      role: targetRole,
      id: { not: currentUserId },
      OR: [
        { firstName: { contains: searchTerm, mode: "insensitive" } },
        { lastName: { contains: searchTerm, mode: "insensitive" } },
        { headline: { contains: searchTerm, mode: "insensitive" } },
        { bio: { contains: searchTerm, mode: "insensitive" } },
        { location: { contains: searchTerm, mode: "insensitive" } }
      ]
    };

    const profileWhere = {
      isActive: true
    };
    
    // Don't add profile OR conditions for simple name searches
    // This allows user name matches to work without requiring profile matches

    const combinedWhere = {
      ...profileWhere,
      user: userWhere
    };

    console.log("Query where clause:", JSON.stringify(combinedWhere, null, 2));
    console.log("\n");

    const trainers = await client.trainerProfile.findMany({
      where: combinedWhere,
      select: {
        id: true,
        uniqueId: true,
        bio: true,
        location: true,
        experience: true,
        skills: true,
        rating: true,
        verified: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            bio: true,
            headline: true,
            location: true,
            role: true
          }
        }
      },
      take: 10
    });

    console.log(`✅ Found ${trainers.length} trainers\n`);
    
    trainers.forEach(t => {
      const name = t.user.firstName 
        ? `${t.user.firstName} ${t.user.lastName || ''}`.trim()
        : 'Unknown';
      console.log(`   ${t.uniqueId} - ${name}`);
      console.log(`      Location: ${t.location || 'Not set'}`);
      console.log(`      Bio: ${t.bio || 'Not set'}`);
      console.log("");
    });

    if (trainers.length === 0) {
      console.log("❌ No trainers found!");
      console.log("\nLet's check if Gourav exists without filters:");
      
      const gouravDirect = await client.trainerProfile.findFirst({
        where: {
          user: {
            firstName: { contains: "Gourav", mode: "insensitive" }
          }
        },
        include: {
          user: true
        }
      });
      
      if (gouravDirect) {
        console.log("✅ Gourav exists in database:");
        console.log(JSON.stringify(gouravDirect, null, 2));
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.$disconnect();
  }
}

testGouravSearch();
