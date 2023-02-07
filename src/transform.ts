import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { hexColorRegex, rgbOrRgbaColorRegex, rgb2hex } from './util';

glob(path.join(__dirname, '../../app_hybrid_v10/src/**/*.*(vue|css|less|scss)'), (err, matchedPath) => {
    if (err) throw err;
    matchedPath.forEach((filePath) => {
        const fileName = path.basename(filePath);
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) throw err;
            // change rgb to hex before replace it to css variable
            const replacedData = data
                .replace(new RegExp(rgbOrRgbaColorRegex, 'ig'), (matchedColor) => {
                    if (matchedColor) {
                        const hexColor = rgb2hex(matchedColor);
                        if (hexColor) {
                            console.log(`replace rgb color: ${matchedColor} as ${hexColor}`);
                            return hexColor;
                        }
                    }
                    return matchedColor;
                })
                .replace(new RegExp(hexColorRegex, 'ig'), (matchedColor) => {
                    if (matchedColor) {
                        console.log(`replace hex color: ${matchedColor} with var(--color)`);
                        return `var(--color-${matchedColor.substring(1)})`;
                    }
                    return matchedColor;
                });
            fs.writeFile(filePath, replacedData, (err) => {
                if (err) throw err;
                console.log(`Update ${fileName} success!`);
            });
        });
    });
});
