import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jsPDF } from 'jspdf';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requirements = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'requirements.json'), 'utf8'));
const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
const pageWidth = 210;
const left = 19;
const contentWidth = pageWidth - left * 2;
const green = [18, 76, 51];
const brightGreen = [34, 153, 90];
let y = 22;

pdf.setProperties({
  title: `${requirements.title} - ${requirements.documentTitle}`,
  subject: requirements.subtitle,
  author: requirements.title,
});

pdf.setFillColor(...green);
pdf.rect(0, 0, pageWidth, 72, 'F');
pdf.setTextColor(255, 255, 255);
pdf.setFont('helvetica', 'bold');
pdf.setFontSize(12);
pdf.text(requirements.title.toUpperCase(), left, 25);
pdf.setFontSize(27);
pdf.text(requirements.documentTitle, left, 42);
pdf.setFont('helvetica', 'normal');
pdf.setFontSize(12);
pdf.text(requirements.subtitle, left, 53);
pdf.setFontSize(9);
pdf.text(`CLIENT REVIEW DOCUMENT  |  VERSION ${requirements.version}  |  ${requirements.date.toUpperCase()}`, left, 63);

y = 93;
pdf.setTextColor(...green);
pdf.setFont('helvetica', 'bold');
pdf.setFontSize(15);
pdf.text('Purpose and scope', left, y);
y += 9;
pdf.setTextColor(53, 68, 59);
pdf.setFont('helvetica', 'normal');
pdf.setFontSize(10);
const overview = pdf.splitTextToSize(requirements.overview, contentWidth);
pdf.text(overview, left, y, { lineHeightFactor: 1.45 });
y += overview.length * 5.5 + 13;

function addNewPage() {
  pdf.addPage();
  y = 21;
}

for (const section of requirements.sections) {
  if (y > 252) addNewPage();
  pdf.setFillColor(...brightGreen);
  pdf.roundedRect(left, y - 5, 2.2, 9, 1, 1, 'F');
  pdf.setTextColor(...green);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(section.title, left + 6, y + 1);
  y += 9;

  for (const point of section.points) {
    const lines = pdf.splitTextToSize(point, contentWidth - 8);
    const blockHeight = lines.length * 4.8 + 3;
    if (y + blockHeight > 276) addNewPage();
    pdf.setFillColor(...brightGreen);
    pdf.circle(left + 2, y - 1.1, 0.75, 'F');
    pdf.setTextColor(53, 68, 59);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.text(lines, left + 7, y, { lineHeightFactor: 1.35 });
    y += blockHeight;
  }
  y += 4;
}

const pageCount = pdf.internal.getNumberOfPages();
for (let page = 1; page <= pageCount; page += 1) {
  pdf.setPage(page);
  pdf.setDrawColor(218, 230, 221);
  pdf.line(left, 285, pageWidth - left, 285);
  pdf.setTextColor(105, 121, 110);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('URJA WELLNESS CLUB  |  CLIENT REQUIREMENTS & DEMO SCOPE', left, 291);
  pdf.text(`${page} / ${pageCount}`, pageWidth - left, 291, { align: 'right' });
}

const outputDirectory = path.join(root, 'public');
fs.mkdirSync(outputDirectory, { recursive: true });
const outputPath = path.join(outputDirectory, 'URJA_Wellness_Club_Requirements.pdf');
fs.writeFileSync(outputPath, Buffer.from(pdf.output('arraybuffer')));
console.log(`Created ${path.relative(root, outputPath)} (${pageCount} pages)`);