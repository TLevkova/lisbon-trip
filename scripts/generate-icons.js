const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputSvg = path.join(__dirname, '../static/images/icons/icon.svg');
const outputDir = path.join(__dirname, '../static/images/icons');

async function generateIcons() {
    try {
        // Read the SVG file
        const svgBuffer = fs.readFileSync(inputSvg);

        // Generate icons for each size
        await Promise.all(sizes.map(async (size) => {
            const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
            
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(outputFile);
            
            console.log(`Generated ${outputFile}`);
        }));

        console.log('Icon generation complete!');
    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons(); 