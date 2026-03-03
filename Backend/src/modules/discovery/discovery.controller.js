import prisma from "../../db.js";

export const advancedSearch = async (req, res, next) => {
    try {
        const {
            role,
            skill,
            location,
            minRating,
            minExperience,
            maxExperience,
            verified,
            page = 1,
            limit = 20,
            sort = "rating_desc",
            search // General search term for name, headline, bio
        } = req.query;

        const where = {};
        const userWhere = { isActive: true };

        // Role filter
        if (role && ["TRAINER", "INSTITUTION"].includes(role)) {
            userWhere.role = role;
        }

        // General search filter - searches across multiple fields
        if (search && search.trim()) {
            const searchTerm = search.trim();
            userWhere.OR = [
                { firstName: { contains: searchTerm, mode: "insensitive" } },
                { lastName: { contains: searchTerm, mode: "insensitive" } },
                { username: { contains: searchTerm, mode: "insensitive" } },
                { headline: { contains: searchTerm, mode: "insensitive" } },
                { bio: { contains: searchTerm, mode: "insensitive" } },
                { location: { contains: searchTerm, mode: "insensitive" } }
            ];
        }

        // Location filter (specific location filter, overrides search if both provided)
        if (location && location.trim() && !search) {
            userWhere.location = {
                contains: location.trim(),
                mode: "insensitive"
            };
        }

        // Build profile-specific filters
        let profileWhere = { isActive: true };

        if (role === "TRAINER" || !role) {
            // Skill filter - search in skills array
            if (skill && skill.trim()) {
                const skillTerm = skill.trim();
                profileWhere.skills = {
                    some: {
                        contains: skillTerm,
                        mode: "insensitive"
                    }
                };
            }
            
            // Rating filter
            if (minRating) {
                profileWhere.rating = { gte: parseFloat(minRating) };
            }
            
            // Experience filter
            if (minExperience !== undefined || maxExperience !== undefined) {
                profileWhere.experience = {
                    ...(minExperience && { gte: parseInt(minExperience) }),
                    ...(maxExperience && { lte: parseInt(maxExperience) })
                };
            }
            
            // Verified filter
            if (verified === "true") {
                profileWhere.verified = true;
            }

            // Bio/location search in profile
            if (search && search.trim()) {
                const searchTerm = search.trim();
                profileWhere.OR = [
                    { bio: { contains: searchTerm, mode: "insensitive" } },
                    { location: { contains: searchTerm, mode: "insensitive" } },
                    { skills: { hasSome: [searchTerm] } }
                ];
            }
        } else if (role === "INSTITUTION") {
            if (minRating) {
                profileWhere.rating = { gte: parseFloat(minRating) };
            }
            
            // Institution name and location search
            if (search && search.trim()) {
                const searchTerm = search.trim();
                profileWhere.OR = [
                    { name: { contains: searchTerm, mode: "insensitive" } },
                    { location: { contains: searchTerm, mode: "insensitive" } }
                ];
            }
        }

        // Sorting
        const sortMap = {
            rating_desc: { rating: "desc" },
            rating_asc: { rating: "asc" },
            experience_desc: { experience: "desc" },
            experience_asc: { experience: "asc" },
            newest: { createdAt: "desc" }
        };

        const orderBy = sortMap[sort] || sortMap.rating_desc;

        // Query based on role
        let results = [];
        let total = 0;

        if (!role || role === "TRAINER") {
            // Combine profile and user filters
            const combinedWhere = {
                ...profileWhere,
                user: userWhere
            };

            const [trainers, trainerCount] = await Promise.all([
                prisma.trainerProfile.findMany({
                    where: combinedWhere,
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                username: true,
                                email: true,
                                profilePicture: true,
                                bio: true,
                                headline: true,
                                location: true,
                                role: true
                            }
                        }
                    },
                    orderBy,
                    skip: (parseInt(page) - 1) * parseInt(limit),
                    take: parseInt(limit)
                }),
                prisma.trainerProfile.count({ where: combinedWhere })
            ]);

            results = trainers
                .filter(t => t.user)
                .map(t => ({
                    ...t.user,
                    profile: {
                        id: t.id,
                        bio: t.bio,
                        location: t.location,
                        experience: t.experience,
                        skills: t.skills,
                        rating: t.rating,
                        verified: t.verified,
                        completionRate: t.completionRate,
                        responseTime: t.responseTime
                    }
                }));
            total = trainerCount;
        } else if (role === "INSTITUTION") {
            // Combine profile and user filters
            const combinedWhere = {
                ...profileWhere,
                user: userWhere
            };

            const [institutions, institutionCount] = await Promise.all([
                prisma.institutionProfile.findMany({
                    where: combinedWhere,
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                username: true,
                                email: true,
                                profilePicture: true,
                                bio: true,
                                headline: true,
                                location: true,
                                role: true
                            }
                        }
                    },
                    orderBy: { rating: orderBy.rating || "desc" },
                    skip: (parseInt(page) - 1) * parseInt(limit),
                    take: parseInt(limit)
                }),
                prisma.institutionProfile.count({ where: combinedWhere })
            ]);

            results = institutions
                .filter(i => i.user)
                .map(i => ({
                    ...i.user,
                    profile: {
                        id: i.id,
                        name: i.name,
                        location: i.location,
                        rating: i.rating
                    }
                }));
            total = institutionCount;
        }

        res.json({
            success: true,
            data: results,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailableSkills = async (req, res, next) => {
    try {
        const trainers = await prisma.trainerProfile.findMany({
            where: { isActive: true },
            select: { skills: true }
        });

        const allSkills = trainers.flatMap(t => t.skills);
        const uniqueSkills = [...new Set(allSkills)].sort();

        res.json({ success: true, data: uniqueSkills });
    } catch (error) {
        next(error);
    }
};
