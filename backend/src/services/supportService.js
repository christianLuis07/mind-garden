const { prisma } = require("../config/database");

class SupportService {
  async createSupportGroup(groupData, creatorId) {
    const { name, description, isPublic, maxMembers } = groupData;

    const supportGroup = await prisma.supportGroup.create({
      data: {
        name,
        description,
        isPublic: isPublic !== undefined ? isPublic : true,
        maxMembers: maxMembers || 50,
      },
    });

    // Tambahkan pembuat sebagai admin
    await prisma.supportGroupMember.create({
      data: {
        userId: creatorId,
        supportGroupId: supportGroup.id,
        role: "admin",
      },
    });

    return this.getGroupWithDetails(supportGroup.id);
  }

  async getSupportGroups(filters = {}) {
    const { page = 1, limit = 10, isPublic, search } = filters;
    const skip = (page - 1) * limit;

    const where = {};

    if (isPublic !== undefined) {
      where.isPublic = isPublic === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [groups, total] = await Promise.all([
      prisma.supportGroup.findMany({
        where,
        include: {
          _count: {
            select: {
              members: true,
              messages: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.supportGroup.count({ where }),
    ]);

    return {
      groups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getSupportGroupById(groupId, userId = null) {
    const group = await prisma.supportGroup.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        // cek apakah user punya undangan
        invitations: {
          where: { userId, status: "pending" },
        },
        _count: {
          select: { members: true, messages: true },
        },
      },
    });

    if (!group) {
      throw new Error("Grup dukungan tidak ditemukan");
    }

    // Logic akses private group
    if (!group.isPublic) {
      if (!userId) {
        throw new Error("Kamu tidak memiliki akses ke grup privat ini");
      }

      const isMember = group.members.some((member) => member.userId === userId);
      const hasInvitation = group.invitations.length > 0;

      if (!isMember && !hasInvitation) {
        throw new Error("Kamu bukan anggota dari grup privat ini");
      }
    }

    // Menambahkan helper untuk frontend
    const isMember = group.members.some((m) => m.userId === userId);
    const hasPendingInvite = group.invitations.length > 0;

    return { ...group, isMember, hasPendingInvite };
  }

  async joinSupportGroup(groupId, userId) {
    const group = await prisma.supportGroup.findUnique({
      where: { id: groupId },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    if (!group) {
      throw new Error("Grup dukungan tidak ditemukan");
    }

    if (!group.isPublic) {
      // Cek undangan
      const invitation = await prisma.supportGroupInvitation.findFirst({
        where: {
          userId,
          supportGroupId: groupId,
          status: "pending",
        },
      });
      if (!invitation) {
        throw new Error(
          "ini adalah grup privat. Kamu memerlukan undangan untuk bergabung."
        );
      }

      // update status undangan menjadi accepted
      await prisma.supportGroupInvitation.update({
        where: { id: invitation.id },
        data: { status: "accepted" },
      });
    }

    // Periksa apakah grup sudah penuh
    if (group._count.members >= group.maxMembers) {
      throw new Error("Grup ini telah mencapai batas maksimum anggota");
    }

    // Periksa apakah pengguna sudah menjadi anggota
    const existingMember = await prisma.supportGroupMember.findUnique({
      where: {
        userId_supportGroupId: {
          userId,
          supportGroupId: groupId,
        },
      },
    });

    if (existingMember) {
      throw new Error("Kamu sudah menjadi anggota grup ini");
    }

    const member = await prisma.supportGroupMember.create({
      data: {
        userId,
        supportGroupId: groupId,
        role: "member",
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

    return member;
  }

  async inviteUser(groupId, email, requesterId) {
    // cek apakah grup ada atau tidak
    const group = await prisma.supportGroup.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      throw new Error("Grup dukungan tidak ditemukan");
    }

    // Cek apakah pengundang adalah member grup tersebut
    const requester = await prisma.supportGroupMember.findUnique({
      where: {
        userId_supportGroupId: { userId: requesterId, supportGroupId: groupId },
      },
    });
    if (!requester) {
      throw new Error("Hanya anggota grup yang dapat mengundang pengguna lain");
    }

    // cari user yang ingin diundang
    const userToInvite = await prisma.user.findUnique({ where: { email } });
    if (!userToInvite) {
      throw new Error("Pengguna dengan email tersebut tidak ditemukan");
    }

    // cek apakah user sudah menjadi member
    const isAlreadyMember = await prisma.supportGroupMember.findUnique({
      where: {
        userId_supportGroupId: {
          userId: userToInvite.id,
          supportGroupId: groupId,
        },
      },
    });
    if (isAlreadyMember) {
      throw new Error("Pengguna tersebut sudah menjadi anggota grup");
    }

    // cek apakah sudah ada undangan yang pending
    const existingInvite = await prisma.supportGroupInvitation.findFirst({
      where: {
        userId: userToInvite.id,
        supportGroupId: groupId,
        status: "pending",
      },
    });
    if (existingInvite) {
      throw new Error("Pengguna tersebut sudah diundang ke grup ini");
    }

    // buat undangan
    await prisma.supportGroupInvitation.create({
      data: {
        userId: userToInvite.id,
        supportGroupId: groupId,
        status: "pending",
      },
    });

    return { message: "Undangan berhasil dikirim" };
  }

  async leaveSupportGroup(groupId, userId) {
    const member = await prisma.supportGroupMember.findUnique({
      where: {
        userId_supportGroupId: {
          userId,
          supportGroupId: groupId,
        },
      },
      include: {
        supportGroup: true,
      },
    });

    if (!member) {
      throw new Error("Kamu bukan anggota dari grup ini");
    }

    // Cegah admin keluar jika dia satu-satunya admin
    if (member.role === "admin") {
      const adminCount = await prisma.supportGroupMember.count({
        where: {
          supportGroupId: groupId,
          role: "admin",
        },
      });

      if (adminCount === 1) {
        throw new Error(
          "Kamu adalah satu-satunya admin. Harap tetapkan admin lain sebelum keluar."
        );
      }
    }

    await prisma.supportGroupMember.delete({
      where: {
        userId_supportGroupId: {
          userId,
          supportGroupId: groupId,
        },
      },
    });

    return { message: "Berhasil keluar dari grup dukungan" };
  }

  async getGroupMessages(groupId, userId, filters = {}) {
    const { page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    // Verifikasi akses pengguna ke grup
    await this.verifyGroupAccess(groupId, userId);

    const [messages, total] = await Promise.all([
      prisma.supportGroupMessage.findMany({
        where: { supportGroupId: groupId },
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
      prisma.supportGroupMessage.count({ where: { supportGroupId: groupId } }),
    ]);

    // Balikkan urutan agar pesan terlama muncul dulu (untuk tampilan chat)
    const orderedMessages = messages.reverse();

    return {
      messages: orderedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async createGroupMessage(groupId, userId, messageData) {
    const { content, messageType = "text" } = messageData;

    // Verifikasi akses pengguna ke grup
    await this.verifyGroupAccess(groupId, userId);

    const message = await prisma.supportGroupMessage.create({
      data: {
        content,
        messageType,
        userId,
        supportGroupId: groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        supportGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return message;
  }

  async getUserSupportGroups(userId) {
    const userGroups = await prisma.supportGroupMember.findMany({
      where: { userId },
      include: {
        supportGroup: {
          include: {
            _count: {
              select: {
                members: true,
                messages: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    return userGroups.map((member) => ({
      ...member.supportGroup,
      userRole: member.role,
      joinedAt: member.joinedAt,
    }));
  }

  // Metode bantu
  async getGroupWithDetails(groupId) {
    return await prisma.supportGroup.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            messages: true,
          },
        },
      },
    });
  }

  async verifyGroupAccess(groupId, userId) {
    const group = await prisma.supportGroup.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!group) {
      throw new Error("Grup dukungan tidak ditemukan");
    }

    if (!group.isPublic && group.members.length === 0) {
      throw new Error("Kamu tidak memiliki akses ke grup privat ini");
    }

    return true;
  }
}

module.exports = new SupportService();
