import express from 'express';
import argon2 from 'argon2';
import { createUser, } from '../helpers/userHelper';
import { User } from './user.model'

export const newUser = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        email,
        password,
        name,
    } = req.body;

    const passwordHashed = await argon2.hash(password);
    const user = await createUser(email, passwordHashed, name) ;
    if (user) {
        // @ts-ignore
        res.status(201).json(user.email);
    } else {
        res.status(422).json(email);
    }
};

export const updateUser = async (req: express.Request, res: express.Response, next: Function) => {
};

export const deleteUser = async (req: express.Request, res: express.Response, next: Function) => {
};

export const getAllUsers = async (req: express.Request, res: express.Response, next: Function) => {
    const users = await User.find();
    res.status(200).json(users);
};
