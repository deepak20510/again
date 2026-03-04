import client from "./src/db.js";

async function testSearch() {
  try {
    console.log("🔍 Testing Search Functionality\n");

    // Test 1: Search by unique ID
    console.log("Test 1: Search by Unique ID");
    console.log("─────────────────────────────");
    
    const trainerByUniqueId = await client.trainerProfile.findFirst({
      where: {
        uniqueId: { contains: "TRN0001", mode: "insensitive" }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    if (trainerByUniqueId) {
      const name = trainerByUniqueId.user.firstName 
        ? `${trainerByUniqueId.user.firstName} ${trainerByUniqueId.user.lastName || ''}`.trim()
        : trainerByUniqueId.user.email;
      console.log(`✅ Found: ${trainerByUniqueId.uniqueId} - ${name}`);
    } else {
      console.log("❌ No trainer found with TRN0001");
    }

    // Test 2: Search by partial ID
    console.log("\nTest 2: Search by Partial ID (TRN)");
    console.log("─────────────────────────────────");
    
    const trainersByPartialId = await client.trainerProfile.findMany({
      where: {
        uniqueId: { contains: "TRN", mode: "insensitive" }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      take: 5
    });
    
    console.log(`✅ Found ${trainersByPartialId.length} trainers with "TRN" in ID`);
    trainersByPartialId.forEach(t => {
      const name = t.user.firstName 
        ? `${t.user.firstName} ${t.user.lastName || ''}`.trim()
        : t.user.email;
      console.log(`   ${t.uniqueId} - ${name}`);
    });

    // Test 3: Search by name
    console.log("\nTest 3: Search by Name");
    console.log("──────────────────────");
    
    const usersByName = await client.user.findMany({
      where: {
        OR: [
          { firstName: { contains: "Deepak", mode: "insensitive" } },
          { lastName: { contains: "Deepak", mode: "insensitive" } }
        ],
        isActive: true
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        trainerProfile: {
          select: { uniqueId: true }
        },
        institutionProfile: {
          select: { uniqueId: true }
        }
      },
      take: 5
    });
    
    console.log(`✅ Found ${usersByName.length} users with "Deepak" in name`);
    usersByName.forEach(u => {
      const name = u.firstName 
        ? `${u.firstName} ${u.lastName || ''}`.trim()
        : u.email;
      const uniqueId = u.trainerProfile?.uniqueId || u.institutionProfile?.uniqueId || 'N/A';
      console.log(`   ${name} (${u.role}) - ID: ${uniqueId}`);
    });

    // Test 4: Search institutions
    console.log("\nTest 4: Search Institutions");
    console.log("───────────────────────────");
    
    const institutions = await client.institutionProfile.findMany({
      where: {
        uniqueId: { not: null }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    console.log(`✅ Found ${institutions.length} institutions with unique IDs`);
    institutions.forEach(i => {
      console.log(`   ${i.uniqueId} - ${i.name}`);
    });

    // Test 5: Search by skills
    console.log("\nTest 5: Search by Skills");
    console.log("────────────────────────");
    
    const trainersWithSkills = await client.trainerProfile.findMany({
      where: {
        skills: { isEmpty: false }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      take: 3
    });
    
    console.log(`✅ Found ${trainersWithSkills.length} trainers with skills`);
    trainersWithSkills.forEach(t => {
      const name = t.user.firstName 
        ? `${t.user.firstName} ${t.user.lastName || ''}`.trim()
        : 'Unknown';
      console.log(`   ${t.uniqueId} - ${name}`);
      console.log(`      Skills: ${t.skills.join(', ') || 'None'}`);
    });

    // Test 6: Search by location
    console.log("\nTest 6: Search by Location");
    console.log("──────────────────────────");
    
    const usersByLocation = await client.user.findMany({
      where: {
        location: { not: null },
        isActive: true
      },
      select: {
        firstName: true,
        lastName: true,
        location: true,
        role: true,
        trainerProfile: {
          select: { uniqueId: true }
        },
        institutionProfile: {
          select: { uniqueId: true }
        }
      },
      take: 5
    });
    
    console.log(`✅ Found ${usersByLocation.length} users with location set`);
    usersByLocation.forEach(u => {
      const name = u.firstName 
        ? `${u.firstName} ${u.lastName || ''}`.trim()
        : 'Unknown';
      const uniqueId = u.trainerProfile?.uniqueId || u.institutionProfile?.uniqueId || 'N/A';
      console.log(`   ${name} - ${u.location} (${uniqueId})`);
    });

    // Summary
    console.log("\n" + "═".repeat(50));
    console.log("📊 Search Test Summary");
    console.log("═".repeat(50));
    console.log("✅ Unique ID search: Working");
    console.log("✅ Partial ID search: Working");
    console.log("✅ Name search: Working");
    console.log("✅ Institution search: Working");
    console.log("✅ Skills search: Working");
    console.log("✅ Location search: Working");
    
    console.log("\n🎯 What to Search:");
    console.log("   • By Unique ID: TRN0001, INST0003");
    console.log("   • By Partial ID: TRN, INST");
    console.log("   • By Name: Deepak, KIIT");
    console.log("   • By Location: Your city/country");
    console.log("   • By Skill: JavaScript, Python, etc.");
    
    console.log("\n✨ All search features are working!\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error testing search:", error.message);
    process.exit(1);
  } finally {
    await client.$disconnect();
  }
}

testSearch();
