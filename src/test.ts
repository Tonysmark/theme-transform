import path from 'path';
import fs from 'fs';
import { hexColorRegex } from './util';

const filePath = path.join('__dirname', '../../app_hybrid_v10/src/commons/styles/article.scss');

fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) throw err;
    const replacedData = data.replace(new RegExp(hexColorRegex, 'ig'), (matchedColor) => {
        if (matchedColor) {
            console.log(`replace hex color: ${matchedColor} with var(--color)`);
            // separate # from hex color and replace it with var(--color-)
            return `var(--color-${matchedColor.substring(1)})`;
        }
        return matchedColor;
    });
    fs.writeFile(filePath, replacedData, (err) => {
        if (err) throw err;
        console.log('Update article.scss success!');
    });
});
