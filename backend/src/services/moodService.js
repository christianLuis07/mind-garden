const { prisma } = require("../config/database");
const { calculateMoodStats } = require("../utils/helpers");

class MoodService {
  async createMoodEntry(userId, moodData) {
    const { mood, notes, factors } = moodData;

    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId,
        mood,
        notes,
        factors,
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

    return moodEntry;
  }

  async getUserMoodEntries(userId, filters = {}) {
    const { page = 1, limit = 10, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const where = { userId };

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [entries, total] = await Promise.all([
      prisma.moodEntry.findMany({
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
      prisma.moodEntry.count({ where }),
    ]);

    return {
      entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getMoodAnalytics(userId, timeframe = "7d") {
    const startDate = this.calculateStartDate(timeframe);

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const stats = calculateMoodStats(entries);

    // Weekly patterns
    const weeklyPatterns = this.calculateWeeklyPatterns(entries);

    // Common factors
    const commonFactors = this.analyzeFactors(entries);

    return {
      overview: stats,
      weeklyPatterns,
      commonFactors,
      recentEntries: entries.slice(0, 10),
    };
  }

  calculateStartDate(timeframe) {
    const now = new Date();
    const date = new Date(now);
    switch (timeframe) {
      case "24h":
        date.setDate(now.getDate() - 1);
        break;
      case "7d":
        date.setDate(now.getDate() - 7);
        break;
      case "30d":
        date.setDate(now.getDate() - 30);
        break;
      case "90d":
        date.setDate(now.getDate() - 90);
        break;
      default:
        date.setDate(now.getDate() - 7);
    }
    return date;
  }

  calculateWeeklyPatterns(entries) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const patterns = daysOfWeek.reduce((acc, day) => {
      acc[day] = { count: 0, totalMood: 0, average: 0 };
      return acc;
    }, {});

    entries.forEach((entry) => {
      const day = daysOfWeek[entry.createdAt.getDay()];
      patterns[day].count++;
      patterns[day].totalMood += entry.mood;
    });

    // Calculate averages
    Object.keys(patterns).forEach((day) => {
      if (patterns[day].count > 0) {
        patterns[day].average = parseFloat(
          (patterns[day].totalMood / patterns[day].count).toFixed(2)
        );
      }
    });

    return patterns;
  }

  analyzeFactors(entries) {
    const factors = {};

    entries.forEach((entry) => {
      if (entry.factors && typeof entry.factors === "object") {
        Object.keys(entry.factors).forEach((factor) => {
          if (!factors[factor]) {
            factors[factor] = {
              count: 0,
              values: [],
              averageMood: 0,
            };
          }
          factors[factor].count++;
          factors[factor].values.push(entry.factors[factor]);
        });
      }
    });

    // Calculate average mood for each factor
    Object.keys(factors).forEach((factor) => {
      const factorEntries = entries.filter(
        (entry) => entry.factors && entry.factors[factor] !== undefined
      );

      if (factorEntries.length > 0) {
        const totalMood = factorEntries.reduce(
          (sum, entry) => sum + entry.mood,
          0
        );
        factors[factor].averageMood = parseFloat(
          (totalMood / factorEntries.length).toFixed(2)
        );
      }
    });

    return factors;
  }
}

module.exports = new MoodService();
