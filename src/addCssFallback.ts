import glob from 'glob';
import { entry } from './config';
import fs from 'fs';
import path from 'path';
// var(--color-*)
const cssVariableRuleRex = /(?:var).?(--color-.*?)(?:,?)\)/g;
const rgbVariable2RgbColor = (str) => {
    const [r, g, b, a] = str.split('-');
    if (a) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
};
const swapColorStrategy = (color: string): string => {
    const caseLen = color.split('-').length;
    if (caseLen == 1) {
        return `#${color}`;
    }
    if (caseLen == 2) {
        return `#${color.split('-')[0]}`;
    }
    return rgbVariable2RgbColor(color);
};
glob(entry, (err, matchedPath) => {
    if (err) throw err;
    matchedPath.forEach((filePath) => {
        const fileName = path.basename(filePath);
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) throw err;
            const replacedData = data.replace(cssVariableRuleRex, (matched, colorVariable: string) => {
                const color = colorVariable.replace('--color-', '').replace('-raw', '').replace('-all', '');

                return matched.replace(')', `, ${swapColorStrategy(color)})`);
            });

            // console.log('replacedData : ', replacedData);

            fs.writeFile(filePath, replacedData, (err) => {
                if (err) throw err;
                console.log(`Update ${fileName} success!`);
            });
        });
    });
});
