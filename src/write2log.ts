import fs from 'fs';
import path from 'path';

export const write2log = (fileName: string, data: string) => {
    const _path = path.join(__dirname, `../logs/${fileName}`);
    const _data = typeof data === 'string' ? data : JSON.stringify(data);
    fs.writeFile(_path, _data, (err) => {
        if (err) {
            throw err;
        }
        console.log(`data is written to file ${fileName}`);
    })
};
