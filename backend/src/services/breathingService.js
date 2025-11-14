const { prisma } = require("../config/database");

class BreathingService {
  async createBreathingSession(userId, sessionData) {
    const { duration, technique, calmLevel } = sessionData;

    const breathingSession = await prisma.breathingSession.create({
      data: {
        userId,
        duration: duration || 300, // default 5 minutes
        technique: technique || "box",
        calmLevel,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return breathingSession;
  }

  async getUserBreathingSessions(userId, filters = {}) {
    const { page = 1, limit = 10, startDate, endDate, technique } = filters;
    const skip = (page - 1) * limit;

    const where = { userId };

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Technique filter
    if (technique) {
      where.technique = technique;
    }

    const [sessions, total] = await Promise.all([
      prisma.breathingSession.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.breathingSession.count({ where }),
    ]);

    return {
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getBreathingAnalytics(userId, timeframe = "30d") {
    const startDate = this.calculateStartDate(timeframe);

    const sessions = await prisma.breathingSession.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const stats = this.calculateSessionStats(sessions);
    const techniqueUsage = this.analyzeTechniqueUsage(sessions);
    const weeklyPatterns = this.calculateWeeklyPatterns(sessions);

    return {
      overview: stats,
      techniqueUsage,
      weeklyPatterns,
      recentSessions: sessions.slice(0, 10),
    };
  }

  calculateSessionStats(sessions) {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageDuration: 0,
        averageCalmLevel: 0,
        completionRate: 0,
      };
    }

    const totalDuration = sessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    const averageDuration = totalDuration / sessions.length;
    const completedSessions = sessions.filter(
      (session) => session.completed
    ).length;
    const sessionsWithCalmLevel = sessions.filter(
      (session) => session.calmLevel !== null
    );
    const averageCalmLevel =
      sessionsWithCalmLevel.length > 0
        ? sessionsWithCalmLevel.reduce(
            (sum, session) => sum + session.calmLevel,
            0
          ) / sessionsWithCalmLevel.length
        : 0;

    return {
      totalSessions: sessions.length,
      totalDuration,
      averageDuration: parseFloat(averageDuration.toFixed(2)),
      averageCalmLevel: parseFloat(averageCalmLevel.toFixed(2)),
      completionRate: parseFloat(
        ((completedSessions / sessions.length) * 100).toFixed(2)
      ),
    };
  }

  analyzeTechniqueUsage(sessions) {
    const techniqueCounts = {};
    sessions.forEach((session) => {
      techniqueCounts[session.technique] =
        (techniqueCounts[session.technique] || 0) + 1;
    });

    return techniqueCounts;
  }

  calculateWeeklyPatterns(sessions) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const patterns = daysOfWeek.reduce((acc, day) => {
      acc[day] = { count: 0, totalDuration: 0, averageDuration: 0 };
      return acc;
    }, {});

    sessions.forEach((session) => {
      const day = daysOfWeek[session.createdAt.getDay()];
      patterns[day].count++;
      patterns[day].totalDuration += session.duration;
    });

    // Calculate averages
    Object.keys(patterns).forEach((day) => {
      if (patterns[day].count > 0) {
        patterns[day].averageDuration = parseFloat(
          (patterns[day].totalDuration / patterns[day].count).toFixed(2)
        );
      }
    });

    return patterns;
  }

  calculateStartDate(timeframe) {
    const now = new Date();
    switch (timeframe) {
      case "7d":
        return new Date(now.setDate(now.getDate() - 7));
      case "30d":
        return new Date(now.setDate(now.getDate() - 30));
      case "90d":
        return new Date(now.setDate(now.getDate() - 90));
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  }

  // Breathing techniques data
  getBreathingTechniques() {
    return {
      box: {
        name: "Box Breathing",
        description:
          "Also known as four-square breathing. Inhale, hold, exhale, hold - each for 4 counts.",
        steps: [
          "Inhale slowly through your nose for 4 counts",
          "Hold your breath for 4 counts",
          "Exhale slowly through your mouth for 4 counts",
          "Hold your breath for 4 counts",
          "Repeat the cycle",
        ],
        duration: 300, // 5 minutes
        benefits: [
          "Reduces stress",
          "Improves focus",
          "Regulates nervous system",
        ],
      },
      478: {
        name: "4-7-8 Breathing",
        description:
          "Developed by Dr. Andrew Weil. Inhale for 4, hold for 7, exhale for 8.",
        steps: [
          "Inhale quietly through your nose for 4 counts",
          "Hold your breath for 7 counts",
          "Exhale completely through your mouth for 8 counts",
          "Repeat the cycle 3-4 times",
        ],
        duration: 240, // 4 minutes
        benefits: [
          "Promotes relaxation",
          "Helps with sleep",
          "Reduces anxiety",
        ],
      },
      belly: {
        name: "Belly Breathing",
        description: "Deep diaphragmatic breathing that engages the belly.",
        steps: [
          "Place one hand on your chest and the other on your belly",
          "Inhale slowly through your nose, feeling your belly rise",
          "Exhale slowly through your mouth, feeling your belly fall",
          "Keep your chest relatively still",
        ],
        duration: 300, // 5 minutes
        benefits: [
          "Reduces tension",
          "Improves oxygen exchange",
          "Calms the mind",
        ],
      },
      alternate: {
        name: "Alternate Nostril Breathing",
        description:
          "A yogic breathing technique that alternates between nostrils.",
        steps: [
          "Sit comfortably with your spine straight",
          "Close your right nostril with your right thumb",
          "Inhale through your left nostril",
          "Close your left nostril with your right ring finger",
          "Exhale through your right nostril",
          "Inhale through your right nostril",
          "Close your right nostril and exhale through your left",
          "Repeat the cycle",
        ],
        duration: 360, // 6 minutes
        benefits: [
          "Balances hemispheres of brain",
          "Reduces stress",
          "Improves focus",
        ],
      },
    };
  }
}

module.exports = new BreathingService();
