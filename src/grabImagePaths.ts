import path from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';

glob(path.join(__dirname, '../../app_hybrid_v10/src/**/*.*(vue|css|less|scss)'), (err, matchedPathArr: Array<string>) => {
    if (err) throw err;
    const backgroundImageUrlReg = /background-image:.*url\((.*)\)/gm;
    const backgroundImageUrlReg2 = /backgroundImage:.*url\((.*)\)/gm;

    const allCounts = matchedPathArr.reduce((acc, curr) => {
        const fileName = path.basename(curr);
        const dataString = readFileSync(path.resolve(curr)).toString();
        const matchedString1 = dataString.match(backgroundImageUrlReg);
        const matchedString2 = dataString.match(backgroundImageUrlReg2);
        if (Array.isArray(matchedString1)) {
            console.log(`${fileName} has background-image`);
            acc.push(matchedString1[0]);
        }
        if (Array.isArray(matchedString2)) {
            console.log(`${fileName} has backgroundImage`);
            acc.push(matchedString2[0]);
        }
        return acc;
    }, new Array<string>());
    console.log(`count is ${allCounts.length}`)
});
