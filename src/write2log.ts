import fs from 'fs';
import path from 'path';

export const write2log = (fileName: string, data: string) => {
    const _path = path.join(__dirname, `../logs/${fileName}`);
    fs.writeFile(_path, JSON.stringify(data), (err) => {
        if (err) {
            throw err;
        }
        console.log('Update log success!');
    })
};
