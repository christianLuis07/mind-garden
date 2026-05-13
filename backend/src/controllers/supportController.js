const supportService = require("../services/supportService");
const { successResponse, errorResponse } = require("../utils/response");

const createSupportGroup = async (req, res, next) => {
  try {
    const supportGroup = await supportService.createSupportGroup(
      req.body,
      req.user.id
    );

    successResponse(
      res,
      "Support group created successfully",
      { supportGroup },
      201
    );
  } catch (error) {
    next(error);
  }
};

const getSupportGroups = async (req, res, next) => {
  try {
    const result = await supportService.getSupportGroups(req.query);

    successResponse(res, "Support groups retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getSupportGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supportGroup = await supportService.getSupportGroupById(
      id,
      req.user.id
    );

    successResponse(res, "Support group retrieved successfully", {
      supportGroup,
    });
  } catch (error) {
    next(error);
  }
};

const joinSupportGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await supportService.joinSupportGroup(id, req.user.id);

    successResponse(res, "Successfully joined the support group", { member });
  } catch (error) {
    next(error);
  }
};

const leaveSupportGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await supportService.leaveSupportGroup(id, req.user.id);

    successResponse(res, result.message);
  } catch (error) {
    next(error);
  }
};

const getGroupMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await supportService.getGroupMessages(
      id,
      req.user.id,
      req.query
    );

    successResponse(res, "Group messages retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const createGroupMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await supportService.createGroupMessage(
      id,
      req.user.id,
      req.body
    );

    const io = req.app.get("io");

    if (io) {
      io.to(id).emit("receive_message", message);

      console.log(`Socket.io: pesan dikirim ke group ${id}`);
    } else {
      console.error("Socket.io instance not found in app settings");
    }

    successResponse(res, "Message sent successfully", { message }, 201);
  } catch (error) {
    next(error);
  }
};

const createGroupImageMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "File gambar tidak ditemukan" });
    }

    const imageUrl = req.file.path;

    const message = await supportService.createGroupMessage(
      id,
      req.user.id,
      { content: "Mengirim gambar", messageType: "image", imageUrl }
    );

    const io = req.app.get("io");

    if (io) {
      io.to(id).emit("receive_message", message);
      console.log(`Socket.io: pesan gambar dikirim ke group ${id}`);
    } else {
      console.error("Socket.io instance not found in app settings");
    }

    successResponse(res, "Image message sent successfully", { message }, 201);
  } catch (error) {
    next(error);
  }
};

const getUserSupportGroups = async (req, res, next) => {
  try {
    const userGroups = await supportService.getUserSupportGroups(req.user.id);

    successResponse(res, "User support groups retrieved successfully", {
      groups: userGroups,
    });
  } catch (error) {
    next(error);
  }
};

const inviteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const result = await supportService.inviteUser(id, email, req.user.id);

    successResponse(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

const promoteMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    await supportService.promoteMember(id, userId, req.user.id);
    successResponse(res, "Member promoted to admin successfully", null, 200);
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    await supportService.removeMember(id, userId, req.user.id);
    successResponse(res, "Member removed from group successfully", null, 200);
  } catch (error) {
    next(error);
  }
};

const getGroupMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const members = await supportService.getGroupMembers(id, req.user.id);
    successResponse(
      res,
      "Group members retrieved successfully",
      { members },
      200
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSupportGroup,
  getSupportGroups,
  getSupportGroup,
  joinSupportGroup,
  leaveSupportGroup,
  getGroupMessages,
  createGroupMessage,
  createGroupImageMessage,
  getUserSupportGroups,
  inviteUser,
  promoteMember,
  removeMember,
  getGroupMembers,
};
