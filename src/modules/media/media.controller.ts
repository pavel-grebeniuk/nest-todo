import { Controller, Get, Param, Res } from '@nestjs/common';
import { join, parse } from 'path';

@Controller()
export class MediaController {
  @Get('files/:path(*)')
  async getFile(@Res() res: any, @Param('path') path: string) {
    const filePath = join(__dirname, '..', '..', '..', path);
    const { dir, base } = parse(filePath);

    const options = {
      root: dir,
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
      },
    };
    res.sendFile(base, options, (err) => {
      if (err) {
        res.status(404).send();
      }
    });
  }
}