/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { tmpdir } from 'os';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, writeFile } from 'fs';
import { join as joinPath } from 'path';
import { Request, Response } from 'express';
import mongoDBCore from 'mongodb/lib/core';
import dbClient from '../utils/db';
import { APIError } from '../middlewares/error';

const VALID_FILE_TYPES = {
  folder: 'folder',
  file: 'file',
  image: 'image',
};
const ROOT_FOLDER_ID = 0;
const DEFAULT_ROOT_FOLDER = 'files_manager';
const mkDirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

export default class FilesController {
  /**
   * Uploads a file.
   * @param {Request} req The Express request object.
   * @param {Response} res The Express response object.
   */
  static async postUpload(req, res) {
    const { user } = req;
    const name = `${req.body && req.body.name ? req.body.name : ''}`.trim();
    const type = `${req.body && req.body.type ? req.body.type : ''}`.trim();
    const parentId = req.body && req.body.parentId ? req.body.parentId : ROOT_FOLDER_ID;
    const isPublic = req.body && req.body.isPublic ? req.body.isPublic : false;
    const base64Data = req.body && req.body.data ? req.body.data : '';

    if (name.length === 0) {
      throw new APIError(400, 'Missing name');
    }
    if (!Object.values(VALID_FILE_TYPES).includes(type)) {
      throw new APIError(400, 'Missing type');
    }
    if (!req.body.data && type !== VALID_FILE_TYPES.folder) {
      throw new APIError(400, 'Missing data');
    }
    if (parentId !== ROOT_FOLDER_ID) {
      const file = await (await dbClient.filesCollection())
        .findOne({ _id: new mongoDBCore.BSON.ObjectId(parentId) });

      if (!file) {
        throw new APIError(400, 'Parent not found');
      }
      if (file.type !== VALID_FILE_TYPES.folder) {
        throw new APIError(400, 'Parent is not a folder');
      }
    }
    const userId = user._id.toString();
    const baseDir = `${process.env.FOLDER_PATH || ''}`.trim().length > 0
      ? process.env.FOLDER_PATH.trim()
      : joinPath(tmpdir(), DEFAULT_ROOT_FOLDER);
    // default baseDir == '/tmp/files_manager'
    // or (on Windows) '%USERPROFILE%/AppData/Local/Temp/files_manager';
    const newFile = {
      userId,
      name,
      type,
      isPublic,
      parentId,
    };
    await mkDirAsync(baseDir, { recursive: true });
    if (type !== VALID_FILE_TYPES.folder) {
      const localPath = joinPath(baseDir, uuidv4());
      await writeFileAsync(localPath, Buffer.from(base64Data, 'base64'));
      newFile.localPath = localPath;
    }
    const insertionInfo = await (await dbClient.filesCollection())
      .insertOne(newFile);
    res.status(201).json({
      id: insertionInfo.insertedId.toString(),
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }

  static async getShow(req, res) {
    const { user } = req;
    const { id } = req.params;
    const userId = user._id.toString();
    const file = await (await dbClient.filesCollection())
      .findOne({
        _id: new mongoDBCore.BSON.ObjectId(id),
        userId,
      });

    if (!file) {
      throw new APIError(404, 'Not found');
    }
    res.status(200).json({
      id,
      userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  static getIndex(req, res) {
    res.status(200).json({});
  }

  static putPublish(req, res) {
    res.status(200).json({});
  }

  static putUnpublish(req, res) {
    res.status(200).json({});
  }

  static getFile(req, res) {
    res.status(200).json({});
  }
}
