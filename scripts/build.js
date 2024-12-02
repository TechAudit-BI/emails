const { exec } = require('child_process');
const fs = require('fs');

const folder = process.argv[2];
if (!folder) {
	console.error('Specify a folder, e.g., npm run build new-release');
	process.exit(1);
}

if (!fs.existsSync(`templates/${folder}`)) {
	console.error('Specify an existing folder');
	process.exit(1);
}

const input = `templates/${folder}/index.mjml`;
const outputDir = `dist/${folder}`;
const outputFile = `${outputDir}/index.html`;

// Clear the output directory if it exists
if (fs.existsSync(outputDir)) {
	try {
		fs.rmSync(outputDir, { recursive: true, force: true });
	} catch (error) {
		console.error(`Failed to clear directory: ${error.message}`);
		process.exit(1);
	}
}

// Create the output directory
fs.mkdirSync(outputDir, { recursive: true });

const command = `mjml ${input} -o ${outputFile} --config.minify`;

console.log(`Building: ${folder}`);

exec(command, (error, stdout, stderr) => {
	if (error) {
		console.error(`Error: ${error.message}`);
		// delete created directory if build fails
		cleanupOutputDirectory(outputDir);
		return;
	}
	if (stderr) {
		console.error(`stderr: ${stderr}`);
		cleanupOutputDirectory(outputDir);
		return;
	}
	console.log(stdout);
});

function cleanupOutputDirectory(dir) {
	try {
		fs.rmSync(dir, { recursive: true, force: true });
	} catch (cleanupError) {
		console.error(`Failed to clean up directory: ${cleanupError.message}`);
	}
}