const { exec } = require('child_process');
const fs = require('fs');

const folder = process.argv[2];
if (!folder) {
	console.error('Specify a folder, e.g., npm run watch new-release');
	process.exit(1);
}

if (!fs.existsSync(folder)) {
	console.error('Specify an existing folder');
	process.exit(1);
}

const input = `templates/${folder}/index.mjml`;
const outputDir = `dist/${folder}`;

if (!fs.existsSync(outputDir)) {
	// create directory if doesn't exist
	fs.mkdirSync(outputDir, { recursive: true });
}

const command = `mjml -w ${input} -o ${outputDir}`;

console.log(`Watching: ${folder}`);

exec(command, (error, stdout, stderr) => {
	if (error) {
		console.error(`error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.error(`stderr: ${stderr}`);
		return;
	}
	console.log(`stdout: ${stdout}`);
});
