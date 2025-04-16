
import config from "../config/config.js";
import { z } from 'zod';

import { registerUser, loginUser } from "../services/userService.js";

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["customer", "admin"]).default('customer').optional(),
  enabled: z.boolean().default(true).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const getUsersSchema = z.object({
  page: z.string().default('1').transform(Number).optional(),
  limit: z.string().default('10').transform(Number),
  sort: z.string().optional(),
  role: z.enum(["customer", "admin"]).optional(),
  enabled: z.enum(["true", "false"]).optional().transform(val => val === "true"),
});

const userIdSchema = z.object({
  id: z.string(),
})

const updateUserRoleSchema = z.object({
  role: z.enum(["customer", "admin"]),
})

const registerSchema = userSchema.omit({enabled:true})


export const createUser = async (req, res, next) => {
  try {
    const {name, email, password, role, enabled} = userSchema.parse(req.body);

    const user = await userService.createUser({name, email, password, role, enabled}, next);

    res.status(201).json({message: 'User created successfully', user});
  } catch (error) {
    next(error);
  }
}


export const register = async (req, res, next) => {
    try {
        const {name, email, password, role} = userSchema.parse(req.body);

        // Check if the user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {return res.status(400).json({message: 'User already exists',});
        }

        const user = await registerUser({name, email, password, role});
        res.status(201).json({message: 'User created successfully', user: { name: user.name, email: user.email, role: user.role }});
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const {email, password} = loginSchema.parse(req.body);

        // Find the user by email
        const {user, token} = await loginUser({email, password})


        // Generate a JWT token
        

        // Return the token and user data (without the password)
        res.status(200).json({token, user});
    } catch (error) {   
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
  try {
    const { page, limit, sort, role, enabled } = getUsersSchema.parse(req.query);

    const { users, total } = await userService.getAllUsers({page, limit, sort, role, enabled}, next);

    res.json({ users, total, currentPage: page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
      next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const { id } = userIdSchema.parse(req.params);
    const { role } = updateUserRoleSchema.parse(req.body);

    const user = await userService.changeUserRole({id, role}, next);

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
      next(error);
  }
}

export const enableDisableUser = async (req, res, next) => {
  try {
    const { id } = userIdSchema.parse(req.params);

    const user = await userService.enableDisableUser({id}, next);

    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
      next(error);
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = userIdSchema.parse(req.params);

    await userService.deleteUser({id}, next);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
      next(error);
  }
}