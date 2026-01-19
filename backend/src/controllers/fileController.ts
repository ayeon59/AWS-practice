import { Request, Response } from 'express';
import * as fileService from '../services/fileService';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '파일이 없습니다.' });
    }

    const file = await fileService.uploadFileToS3(req.file);
    res.status(201).json({
      message: '파일이 성공적으로 업로드되었습니다.',
      file,
    });
  } catch (error) {
    console.error('파일 업로드 에러:', error);
    res.status(500).json({ error: '파일 업로드에 실패했습니다.' });
  }
};

export const getAllFiles = async (_req: Request, res: Response) => {
  try {
    const files = await fileService.getAllFiles();
    res.json(files);
  } catch (error) {
    console.error('파일 목록 조회 에러:', error);
    res.status(500).json({ error: '파일 목록 조회에 실패했습니다.' });
  }
};

export const getFileById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const file = await fileService.getFileById(id);

    if (!file) {
      return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }

    res.json(file);
  } catch (error) {
    console.error('파일 조회 에러:', error);
    res.status(500).json({ error: '파일 조회에 실패했습니다.' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await fileService.deleteFile(id);

    if (!deleted) {
      return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }

    res.json({ message: '파일이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('파일 삭제 에러:', error);
    res.status(500).json({ error: '파일 삭제에 실패했습니다.' });
  }
};
