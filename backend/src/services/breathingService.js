const { prisma } = require("../config/database");

class BreathingService {
  async createBreathingSession(userId, sessionData) {
    const { duration, technique, calmLevel } = sessionData;

    const breathingSession = await prisma.breathingSession.create({
      data: {
        userId,
        duration: duration || 300,
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

    // Filter rentang tanggal
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Filter teknik
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

    const favoriteTechnique = this.findFavoriteTechnique(techniqueUsage);

    const sessionsPerDay = this.calculateSessionsPerDay(sessions);

    return {
      totalSessions: stats.totalSessions,
      totalDuration: stats.totalDuration, // Dalam menit
      averageCalmLevel: stats.averageCalmLevel,
      favoriteTechnique: favoriteTechnique,
      sessionsPerDay: sessionsPerDay,
      techniqueUsage: techniqueUsage,
      recentSessions: sessions
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5),
    };
  }

  calculateSessionStats(sessions) {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageCalmLevel: 0,
      };
    }

    const totalSeconds = sessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    const totalDuration = Math.round(totalSeconds / 60);

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
      averageCalmLevel: parseFloat(averageCalmLevel.toFixed(1)),
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

  findFavoriteTechnique(techniqueUsage) {
    if (Object.keys(techniqueUsage).length === 0) return "-";

    return Object.entries(techniqueUsage).sort(([, a], [, b]) => b - a)[0][0];
  }

  calculateSessionsPerDay(sessions) {
    const dailyCounts = {};

    sessions.forEach((session) => {
      const dateKey = session.createdAt.toISOString().split("T")[0];
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    });

    return dailyCounts;
  }

  calculateStartDate(timeframe) {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    switch (timeframe) {
      case "7d":
        return new Date(now.setDate(now.getDate() - 7));
      case "30d":
        return new Date(now.setDate(now.getDate() - 30));
      case "90d":
        return new Date(now.setDate(now.getDate() - 90));
      case "1y":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(0);
    }
  }

  getBreathingTechniques() {
    return {
      box: {
        name: "Pernapasan Kotak (Box Breathing)",
        description:
          "Dikenal juga sebagai pernapasan empat persegi. Tarik napas, tahan, buang napas, tahan - masing-masing selama 4 hitungan.",
        steps: [
          "Tarik napas perlahan melalui hidung selama 4 hitungan",
          "Tahan napas selama 4 hitungan",
          "Buang napas perlahan melalui mulut selama 4 hitungan",
          "Tahan napas selama 4 hitungan",
          "Ulangi siklus ini",
        ],
        duration: 300,
        benefits: [
          "Mengurangi stres",
          "Meningkatkan fokus",
          "Mengatur sistem saraf",
        ],
      },
      478: {
        name: "Pernapasan 4-7-8",
        description:
          "Dikembangkan oleh Dr. Andrew Weil. Tarik napas 4 hitungan, tahan 7, buang napas 8.",
        steps: [
          "Tarik napas perlahan melalui hidung selama 4 hitungan",
          "Tahan napas selama 7 hitungan",
          "Buang napas sepenuhnya melalui mulut selama 8 hitungan",
          "Ulangi siklus ini 3-4 kali",
        ],
        duration: 240,
        benefits: [
          "Meningkatkan relaksasi",
          "Membantu tidur lebih cepat",
          "Mengurangi kecemasan",
        ],
      },
      belly: {
        name: "Pernapasan Perut (Belly Breathing)",
        description:
          "Pernapasan diafragma dalam yang melibatkan pengembangan perut.",
        steps: [
          "Letakkan satu tangan di dada dan tangan lainnya di perut",
          "Tarik napas perlahan melalui hidung, rasakan perut mengembang",
          "Buang napas perlahan melalui mulut, rasakan perut mengempis",
          "Usahakan dada tetap diam selama proses ini",
        ],
        duration: 300,
        benefits: [
          "Mengurangi ketegangan fisik",
          "Meningkatkan pertukaran oksigen",
          "Menenangkan pikiran",
        ],
      },
      alternate: {
        name: "Pernapasan Hidung Bergantian",
        description:
          "Teknik pernapasan yoga (Nadi Shodhana) yang bergantian antara lubang hidung kiri dan kanan.",
        steps: [
          "Duduk nyaman dengan punggung tegak",
          "Tutup lubang hidung kanan dengan ibu jari kanan",
          "Tarik napas melalui lubang hidung kiri",
          "Tutup lubang hidung kiri dengan jari manis kanan",
          "Buang napas melalui lubang hidung kanan",
          "Tarik napas kembali melalui lubang hidung kanan",
          "Tutup lubang hidung kanan dan buang napas melalui kiri",
          "Ulangi siklus ini",
        ],
        duration: 360, // 6 menit
        benefits: [
          "Menyeimbangkan otak kiri dan kanan",
          "Mengurangi stres emosional",
          "Meningkatkan konsentrasi",
        ],
      },
    };
  }
}

module.exports = new BreathingService();
