import path from 'path';
import mime from 'mime';
import {v1 as uuid} from 'uuid';
import {createWriteStream} from 'fs';
import {FileUpload} from 'graphql-upload';
import {ApolloError} from 'apollo-server-express';

export const ROOT = path.join(__dirname, '..', '..');

export const upload = {
  single: async (file: Promise<FileUpload>, destination: string): Promise<string> => {
    const {createReadStream, mimetype} = await file;

    const fileName = `${uuid()}.${mime.getExtension(mimetype) ?? 'dat'}`;
    const destinationPath = path.join(ROOT, ...destination.split('/'), fileName);

    return new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(destinationPath, {autoClose: true}))
        .on('finish', () => resolve(`${process.env.BASE_URL_IMAGE}/${destination}/${fileName}`))
        .on('error', () => reject('')),
    );
  },

  multiple: async (files: [Promise<FileUpload>], destination: string, max?: number): Promise<string[]> => {
    if (max && files.length > max) {
      throw new ApolloError('Upload limit reached');
    }

    const readableStreams = await Promise.all(files);

    const destinationFolder = path.join(ROOT, ...destination.split('/'));

    const pipedStreams = readableStreams.map(
      (readStreamInstance): Promise<string> => {
        const {createReadStream, mimetype} = readStreamInstance;

        const fileName = `${uuid()}.${mime.getExtension(mimetype) ?? 'dat'}`;
        const destinationPath = path.join(destinationFolder, fileName);

        return new Promise((resolve, reject) =>
          createReadStream()
            .pipe(createWriteStream(destinationPath, {autoClose: true}))
            .on('finish', () => resolve(`${process.env.BASE_URL_IMAGE}/${destination}/${fileName}`))
            .on('error', () => reject('')),
        );
      },
    );

    return Promise.all(pipedStreams);
  },
};
