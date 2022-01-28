import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
const server = createServer();

server.listen(3334, () => {
  console.log(' 启动成功：3334');
});

server.on('request', async (req, res) => {
  const filePath = path.resolve(process.cwd(), './test.mp3');
  const stat = fs.statSync(filePath);
  const { size } = stat;
  const headObj = {
    code: 206,
    head: {
      'Content-Length': size,
      'content-type': 'audio/mpeg',
    },
  };
  if (req.headers.range) {
    headObj.code = 200;
  } else {
    headObj.head['content-range'] = `bytes 0-${size - 1}/${size}`;
  }

  res.writeHead(headObj.code, headObj.head);
  fs.createReadStream(filePath).pipe(res);
});
