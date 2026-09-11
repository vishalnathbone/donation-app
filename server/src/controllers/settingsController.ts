import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getSettingsRepository } from '../repositories';
import { JsonStorageHelper } from '../utils/jsonStorage';

export class SettingsController {
  static async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const settingsRepo = getSettingsRepository();
      let settings = await settingsRepo.get(year);

      // Check if image files exist in disk folder as fallback
      const yearDir = await JsonStorageHelper.ensureYearDir(year);
      const templateDir = path.join(yearDir, 'receipt-templates');

      if (settings) {
        if (!settings.headerImage && fs.existsSync(path.join(templateDir, 'header.png'))) {
          const buf = fs.readFileSync(path.join(templateDir, 'header.png'));
          settings.headerImage = `data:image/png;base64,${buf.toString('base64')}`;
        }
        if (!settings.footerImage && fs.existsSync(path.join(templateDir, 'footer.png'))) {
          const buf = fs.readFileSync(path.join(templateDir, 'footer.png'));
          settings.footerImage = `data:image/png;base64,${buf.toString('base64')}`;
        }
      }

      res.json({
        success: true,
        data: settings,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year, 10);
      const settingsRepo = getSettingsRepository();

      // 1. Save images to dedicated filesystem folder: data/<year>/receipt-templates/
      const yearDir = await JsonStorageHelper.ensureYearDir(year);
      const templateDir = path.join(yearDir, 'receipt-templates');
      if (!fs.existsSync(templateDir)) {
        fs.mkdirSync(templateDir, { recursive: true });
      }

      const { headerImage, footerImage } = req.body;

      if (headerImage && typeof headerImage === 'string' && headerImage.startsWith('data:image/')) {
        const base64Data = headerImage.split(',')[1];
        fs.writeFileSync(path.join(templateDir, 'header.png'), Buffer.from(base64Data, 'base64'));
      } else if (headerImage === '' || headerImage === null) {
        const headerFile = path.join(templateDir, 'header.png');
        if (fs.existsSync(headerFile)) fs.unlinkSync(headerFile);
      }

      if (footerImage && typeof footerImage === 'string' && footerImage.startsWith('data:image/')) {
        const base64Data = footerImage.split(',')[1];
        fs.writeFileSync(path.join(templateDir, 'footer.png'), Buffer.from(base64Data, 'base64'));
      } else if (footerImage === '' || footerImage === null) {
        const footerFile = path.join(templateDir, 'footer.png');
        if (fs.existsSync(footerFile)) fs.unlinkSync(footerFile);
      }

      // 2. Persist to DB / Settings Repository
      const updated = await settingsRepo.update(year, req.body);

      res.json({
        success: true,
        message: 'Receipt customization settings and image assets saved to DB and disk folder',
        data: updated,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
