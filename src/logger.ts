import dayjs from 'dayjs';
import { Logger } from 'seyfert';
import { red, LogLevels, cyan, dim, yellow, bgRed, gray, bold } from 'seyfert/lib/common/index.js';

export function customizeLogger() {
    Logger.customize((_, level, args) => {
        let color = red;

        switch (level) {
            case LogLevels.Info: color = cyan; break;
            case LogLevels.Debug: color = dim; break;
            case LogLevels.Warn: color = yellow; break;
            case LogLevels.Fatal: color = bgRed; break;
        };

        return [
            brackets(gray(dayjs().format('YYYY-MM-DD HH:mm:ss'))),
            brackets(dim(`RSS: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MiB`)),
            brackets(color(Logger.prefixes.get(level) ?? 'UNKNOWN')),
            ...args
        ];
    });
};

function brackets(content: string) {
    return `${bold(gray('['))}${content}${bold(gray(']'))}`;
};
