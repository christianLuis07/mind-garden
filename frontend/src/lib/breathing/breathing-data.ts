import { BreathingTechnique } from "@/types/breathing";

export const mockBreathingTechniques: BreathingTechnique[] = [
  {
    id: "1",
    name: "Pernapasan 4-7-8",
    description:
      "Teknik relaksasi populer yang efektif untuk menenangkan pikiran dan membantu tidur lebih nyenyak.",
    duration: 300,
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8,
      holdAfterExhale: 0,
    },
    benefits: [
      "Mengurangi kecemasan",
      "Meningkatkan kualitas tidur",
      "Menurunkan tingkat stres",
      "Memicu respons relaksasi tubuh",
    ],
    difficulty: "beginner",
  },
  {
    id: "2",
    name: "Pernapasan Kotak (Box Breathing)",
    description:
      "Teknik sederhana namun ampuh yang sering digunakan oleh Navy SEAL untuk menjaga ketenangan dan fokus di bawah tekanan.",
    duration: 240,
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4,
    },
    benefits: [
      "Meningkatkan konsentrasi",
      "Meredakan stres seketika",
      "Meningkatkan performa mental",
      "Menyeimbangkan sistem saraf",
    ],
    difficulty: "beginner",
  },
  {
    id: "3",
    name: "Pernapasan Dalam",
    description:
      "Latihan dasar menarik napas panjang untuk mendapatkan rasa tenang secara instan.",
    duration: 180,
    pattern: {
      inhale: 5,
      hold: 2,
      exhale: 7,
      holdAfterExhale: 1,
    },
    benefits: [
      "Ketenangan instan",
      "Meningkatkan oksigen dalam darah",
      "Merelaksasi ketegangan otot",
      "Menjernihkan pikiran",
    ],
    difficulty: "beginner",
  },
  {
    id: "4",
    name: "Metode Pernapasan Wim Hof",
    description:
      "Teknik pernapasan tingkat lanjut untuk meningkatkan energi vital dan fokus yang tajam.",
    duration: 600,
    pattern: {
      inhale: 2,
      hold: 0,
      exhale: 2,
      holdAfterExhale: 15,
    },
    benefits: [
      "Lonjakan energi alami",
      "Memperkuat sistem imun",
      "Mempertajam fokus",
      "Mengurangi peradangan tubuh",
    ],
    difficulty: "intermediate",
  },
];

export const mockBreathingSessions = [
  {
    id: "1",
    userId: "user1",
    duration: 300,
    technique: "Pernapasan 4-7-8",
    completed: true,
    calmLevel: 8,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "user1",
    duration: 240,
    technique: "Pernapasan Kotak (Box Breathing)",
    completed: true,
    calmLevel: 7,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
