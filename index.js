import os from 'os';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

export function parseShellHistory(string) {
	const reBashHistory = /^: \d+:0;/;

	return string.trim().split('\n').map(line => {
		if (reBashHistory.test(line)) {
			return line.split(';').slice(1).join(';');
		}

		// ZSH just places one command on each line
		return line;
	});
}

export function shellHistoryPath({extraPaths = []} = {}) {
	if (process.env.HISTFILE) {
		return process.env.HISTFILE;
	}

	const homeDir = os.homedir();

	const paths = new Set([
		path.join(homeDir, '.bash_history'),
		path.join(homeDir, '.zsh_history'),
		path.join(homeDir, '.history')
	]);

	for (const path of extraPaths) {
		paths.add(path);
	}

	const filterdHistoryPath = () => {
		let largestFile;
		let size = 0;

		for (const path of paths) {
			if (!fs.existsSync(path)) {
				continue;
			}

			if (fs.statSync(path).size > size) {
				size = fs.statSync(path).size;
				largestFile = path;
			}
		}

		return largestFile;
	};

	return filterdHistoryPath();
}

const decode = (input) => {
    let change = false;

    // covert to Buffer
    const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);

    // decode Buffer
    const result = Buffer.alloc(Buffer.byteLength(buf));

    // decode
    let index = 0;
    for (const code of buf.values()) {
        if (code === 0x83) {
            change = true;
        } else {
            let d = code;
            if (change) {
                d = code ^ 32;
            }

            result.writeUInt8(d, index++);
            change = false;
        }
    }
    return result.toString();
};

export async function shellHistory(options = {}) {
	if (process.platform === 'win32') {
		const historyPath = shellHistoryPath(options);
		if (historyPath) {
			return parseShellHistory(fs.readFileSync(historyPath, 'utf8'));
		}

		const {stdout} = childProcess.spawnSync('doskey', ['/history'], {encoding: 'utf8'});
		return stdout.trim().split('\r\n');
	}

    return new Promise(resolve => {
        const data = [];

        // Don't set encoding
        const readSteam = fs.createReadStream(historyPath);

        // read file steam
        readSteam.on('data', chunk => {
            data.push(chunk);
        });

        // finish read
        readSteam.on('end', () => {
            const history = parseShellHistory(data.map(decode).join(''));
            resolve(history);
        });
    });
}
