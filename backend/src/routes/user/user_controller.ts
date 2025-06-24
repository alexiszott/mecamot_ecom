import { $Enums } from "@prisma/client";
import { success } from "../../utils/apiReponse.js";
import { log } from "../../utils/logger.js";
import {
  fetchUserService,
  fetchUsersService,
  softDeleteUserService,
  updateUserService,
} from "./user_service.js";
import { error } from "console";
import { HTTP_STATUS_CODES } from "../../utils/http_status_code.js";

export const fetchUsers = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!req.isAdmin) {
    return error(res, {
      status: HTTP_STATUS_CODES.Forbidden,
      message: "Access denied - Admins only",
      code: HTTP_STATUS_CODES.Forbidden,
      errors: { general: ["Access denied - Admins only"] },
    });
  }

  try {
    log.info(`Fetching users - Page: ${page}, Limit: ${limit}, Skip: ${skip}`, {
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
    });

    const [users, totalUsers] = await fetchUsersService(limit, skip);

    log.info(`Fetched ${users.length} users out of ${totalUsers} total users`, {
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });

    return success(res, {
      status: HTTP_STATUS_CODES.OK,
      message: "Users fetched successfully",
      code: HTTP_STATUS_CODES.OK,
      data: {
        users,
        totalUsers,
        page,
        limit,
      },
    });
  } catch (error) {
    log.error("Error fetching users", {
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
};

export const fetchUser = async (req, res, next) => {
  const userId = req.query.id;

  if (!req.isAdmin) {
    return error(res, {
      status: HTTP_STATUS_CODES.Forbidden,
      message: "Access denied - Admins only",
      code: HTTP_STATUS_CODES.Forbidden,
      errors: { general: ["Access denied - Admins only"] },
    });
  }

  try {
    log.info(`Fetching user - id: ${req.query.id}`, {
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
    });

    const user = await fetchUserService(userId);

    log.info(`Fetched ${user?.id}`, {
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
      userId,
    });

    if (!user) {
      return error(res, {
        status: HTTP_STATUS_CODES.NotFound,
        message: "User not found",
        code: HTTP_STATUS_CODES.NotFound,
        errors: { general: ["User not found"] },
      });
    }

    return success(res, {
      status: HTTP_STATUS_CODES.OK,
      message: "Users fetched successfully",
      code: HTTP_STATUS_CODES.OK,
      data: {
        user,
      },
    });
  } catch (error) {
    log.error("Error fetching users", {
      ip: req.ip,
      sessionId: req.sessionID,
      userAgent: req.headers["user-agent"],
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  if (!req.isAdmin) {
    return error(res, {
      status: HTTP_STATUS_CODES.Forbidden,
      message: "Access denied - Admins only",
      code: HTTP_STATUS_CODES.Forbidden,
      errors: { general: ["Access denied - Admins only"] },
    });
  }

  try {
    const user = await softDeleteUserService(userId);

    if (!user) {
      return error(res, {
        status: HTTP_STATUS_CODES.NotFound,
        message: "User not found",
        code: HTTP_STATUS_CODES.NotFound,
        errors: { general: ["User not found"] },
      });
    }

    return success(res, {
      status: HTTP_STATUS_CODES.OK,
      message: "User deleted (archived) successfully",
      code: HTTP_STATUS_CODES.OK,
      data: { user },
    });
  } catch (err) {
    log.error("Error deleting user", {
      error: err.message,
      stack: err.stack,
    });
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const updates = req.body;

  if (!req.isAdmin) {
    return error(res, {
      status: HTTP_STATUS_CODES.Forbidden,
      message: "Access denied - Admins only",
      code: HTTP_STATUS_CODES.Forbidden,
      errors: { general: ["Access denied - Admins only"] },
    });
  }

  try {
    const user = await updateUserService(userId, updates);

    if (!user) {
      return error(res, {
        status: HTTP_STATUS_CODES.NotFound,
        message: "User not found",
        code: HTTP_STATUS_CODES.NotFound,
        errors: { general: ["User not found"] },
      });
    }

    return success(res, {
      status: HTTP_STATUS_CODES.OK,
      message: "User updated successfully",
      code: HTTP_STATUS_CODES.OK,
      data: { user },
    });
  } catch (err) {
    log.error("Error updating user", {
      error: err.message,
      stack: err.stack,
    });
    next(err);
  }
};
