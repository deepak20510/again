import client from "./src/db.js";

async function testSearch() {
  try {
    console.log("🔍 Testing new search implementation...\n");

    // Test 1: Search for "Gourav" (name search)
    console.log("TEST 1: Searching for 'Gourav'");
    const searchTerm1 = "Gourav";
    const where1 = {
      isActive: true,
      user: {
        isActive: true,
        isBanned: false,
        role: "TRAINER",
        id: { not: "test-user-id" }
      },
      OR: [
        // User fields
        { user: { firstName: { contains: searchTerm1, mode: "insensitive" } } },
        { user: { lastName: { contains: searchTerm1, mode: "insensitive" } } },
        { user: { headline: { contains: searchTerm1, mode: "insensitive" } } },
        { user: { bio: { contains: searchTerm1, mode: "insensitive" } } },
        { user: { location: { contains: searchTerm1, mode: "insensitive" } } },
        // Profile fields
        { uniqueId: { contains: searchTerm1, mode: "insensitive" } },
        { bio: { contains: searchTerm1, mode: "insensitive" } },
        { location: { contains: searchTerm1, mode: "insensitive" } },
        { skills: { has: searchTerm1 } }
      ]
    };

    const result1 = await client.trainerProfile.findMany({
      where: where1,
      select: {
        id: true,
        uniqueId: true,
        bio: true,
        location: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      take: 5
    });

    console.log(`✅ Found ${result1.length} trainers`);
    result1.forEach(t => {
      console.log(`   ${t.uniqueId} - ${t.user.firstName} ${t.user.lastName || ''}`);
    });
    console.log("");

    // Test 2: Search for "Deepak" (should find 2)
    console.log("TEST 2: Searching for 'Deepak'");
    const searchTerm2 = "Deepak";
    const where2 = {
      isActive: true,
      user: {
        isActive: true,
        isBanned: false,
        role: "TRAINER",
        id: { not: "test-user-id" }
      },
      OR: [
        { user: { firstName: { contains: searchTerm2, mode: "insensitive" } } },
        { user: { lastName: { contains: searchTerm2, mode: "insensitive" } } },
        { user: { headline: { contains: searchTerm2, mode: "insensitive" } } },
        { user: { bio: { contains: searchTerm2, mode: "insensitive" } } },
        { user: { location: { contains: searchTerm2, mode: "insensitive" } } },
        { uniqueId: { contains: searchTerm2, mode: "insensitive" } },
        { bio: { contains: searchTerm2, mode: "insensitive" } },
        { location: { contains: searchTerm2, mode: "insensitive" } },
        { skills: { has: searchTerm2 } }
      ]
    };

    const result2 = await client.trainerProfile.findMany({
      where: where2,
      select: {
        id: true,
        uniqueId: true,
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      take: 5
    });

    console.log(`✅ Found ${result2.length} trainers`);
    result2.forEach(t => {
      console.log(`   ${t.uniqueId} - ${t.user.firstName} ${t.user.lastName || ''}`);
    });
    console.log("");

    // Test 3: Search for "TRN0001" (ID search)
    console.log("TEST 3: Searching for 'TRN0001'");
    const searchTerm3 = "TRN0001";
    const where3 = {
      isActive: true,
      user: {
        isActive: true,
        isBanned: false,
        role: "TRAINER",
        id: { not: "test-user-id" }
      },
      OR: [
        { user: { firstName: { contains: searchTerm3, mode: "insensitive" } } },
        { user: { lastName: { contains: searchTerm3, mode: "insensitive" } } },
        { user: { headline: { contains: searchTerm3, mode: "insensitive" } } },
        { user: { bio: { contains: searchTerm3, mode: "insensitive" } } },
        { user: { location: { contains: searchTerm3, mode: "insensitive" } } },
        { uniqueId: { contains: searchTerm3, mode: "insensitive" } },
        { bio: { contains: searchTerm3, mode: "insensitive" } },
        { location: { contains: searchTerm3, mode: "insensitive" } },
        { skills: { has: searchTerm3 } }
      ]
    };

    const result3 = await client.trainerProfile.findMany({
      where: where3,
      select: {
        id: true,
        uniqueId: true,
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      take: 5
    });

    console.log(`✅ Found ${result3.length} trainers`);
    result3.forEach(t => {
      console.log(`   ${t.uniqueId} - ${t.user.firstName} ${t.user.lastName || ''}`);
    });
    console.log("");

    // Test 4: Search for "JavaScript" (skill search)
    console.log("TEST 4: Searching for 'JavaScript'");
    const searchTerm4 = "JavaScript";
    const where4 = {
      isActive: true,
      user: {
        isActive: true,
        isBanned: false,
        role: "TRAINER",
        id: { not: "test-user-id" }
      },
      OR: [
        { user: { firstName: { contains: searchTerm4, mode: "insensitive" } } },
        { user: { lastName: { contains: searchTerm4, mode: "insensitive" } } },
        { user: { headline: { contains: searchTerm4, mode: "insensitive" } } },
        { user: { bio: { contains: searchTerm4, mode: "insensitive" } } },
        { user: { location: { contains: searchTerm4, mode: "insensitive" } } },
        { uniqueId: { contains: searchTerm4, mode: "insensitive" } },
        { bio: { contains: searchTerm4, mode: "insensitive" } },
        { location: { contains: searchTerm4, mode: "insensitive" } },
        { skills: { has: searchTerm4 } }
      ]
    };

    const result4 = await client.trainerProfile.findMany({
      where: where4,
      select: {
        id: true,
        uniqueId: true,
        skills: true,
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      take: 5
    });

    console.log(`✅ Found ${result4.length} trainers`);
    result4.forEach(t => {
      console.log(`   ${t.uniqueId} - ${t.user.firstName} ${t.user.lastName || ''}`);
      console.log(`      Skills: ${t.skills.join(', ')}`);
    });
    console.log("");

    console.log("✅ All tests completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.$disconnect();
  }
}

testSearch();
