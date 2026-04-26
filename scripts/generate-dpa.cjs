#!/usr/bin/env node
// Generates static/dpa/mochify-dpa.pdf
// Run with: node scripts/generate-dpa.cjs

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../static/dpa');
const OUT_FILE = path.join(OUT_DIR, 'mochify-dpa.pdf');

fs.mkdirSync(OUT_DIR, { recursive: true });

const doc = new PDFDocument({ margin: 72, size: 'A4' });
const stream = fs.createWriteStream(OUT_FILE);
doc.pipe(stream);

// ── Palette ──────────────────────────────────────────────────────────────────
const BROWN  = '#4A2C2C';
const BODY   = '#6C3F31';
const BORDER = '#FFE5EC';

const L = 72;
const R = doc.page.width - 72;
const W = R - L;

// ── Helpers ───────────────────────────────────────────────────────────────────
function checkPageBreak(needed = 60) {
    if (doc.y + needed > doc.page.height - 72) doc.addPage();
}

function heading1(text) {
    doc.moveDown(0.5)
       .font('Helvetica-Bold').fontSize(20).fillColor(BROWN)
       .text(text, L, doc.y, { width: W, align: 'center' })
       .moveDown(0.8);
}

function heading2(text) {
    checkPageBreak(50);
    doc.moveDown(0.8)
       .font('Helvetica-Bold').fontSize(13).fillColor(BROWN)
       .text(text, L, doc.y, { width: W });
    doc.moveDown(0.2);
    const y = doc.y;
    doc.moveTo(L, y).lineTo(R, y).strokeColor(BORDER).lineWidth(0.75).stroke();
    doc.moveDown(0.5);
}

function heading3(text) {
    checkPageBreak(40);
    doc.moveDown(0.6)
       .font('Helvetica-Bold').fontSize(11).fillColor(BROWN)
       .text(text, L, doc.y, { width: W });
    doc.moveDown(0.4);
}

function body(text) {
    doc.font('Helvetica').fontSize(10).fillColor(BODY)
       .text(text, L, doc.y, { width: W });
    doc.moveDown(0.4);
}

function numberedItem(n, text) {
    const numW = 20;
    const txtX = L + numW;
    const txtW = W - numW;
    const startY = doc.y;
    doc.font('Helvetica-Bold').fontSize(10).fillColor(BROWN)
       .text(`${n}.`, L, startY, { width: numW });
    doc.font('Helvetica').fontSize(10).fillColor(BODY)
       .text(text, txtX, startY, { width: txtW });
    doc.moveDown(0.4);
}

function bullet(text, indent = 0) {
    doc.font('Helvetica').fontSize(10).fillColor(BODY)
       .text('•  ' + text, L + indent, doc.y, { width: W - indent });
    doc.moveDown(0.3);
}

function hr() {
    doc.moveDown(0.5);
    const y = doc.y;
    doc.moveTo(L, y).lineTo(R, y).strokeColor(BORDER).lineWidth(0.5).stroke();
    doc.moveDown(0.8);
}

// ── Generic table ─────────────────────────────────────────────────────────────
function table(cols, rows) {
    const CELL_PAD = 8;
    const HEADER_H = 24;

    const xs = [];
    let cx = L;
    cols.forEach(c => { xs.push(cx); cx += c.width; });
    const totalW = cols.reduce((s, c) => s + c.width, 0);

    checkPageBreak(HEADER_H + rows.length * 28);

    let rowY = doc.y;

    // Header
    doc.rect(L, rowY, totalW, HEADER_H).fillColor('#FFF0F3').fill();
    cols.forEach((col, i) => {
        doc.rect(xs[i], rowY, col.width, HEADER_H).strokeColor(BORDER).lineWidth(0.5).stroke();
        doc.font('Helvetica-Bold').fontSize(9).fillColor(BROWN)
           .text(col.header, xs[i] + CELL_PAD, rowY + 8, { width: col.width - CELL_PAD * 2 });
    });
    rowY += HEADER_H;

    rows.forEach(row => {
        let rowH = 18;
        row.forEach((cell, i) => {
            const h = doc.heightOfString(String(cell), {
                font: 'Helvetica', fontSize: 9,
                width: cols[i].width - CELL_PAD * 2
            });
            rowH = Math.max(rowH, h + CELL_PAD * 2);
        });

        if (rowY + rowH > doc.page.height - 72) {
            doc.addPage();
            rowY = 72;
        }

        row.forEach((cell, i) => {
            doc.rect(xs[i], rowY, cols[i].width, rowH).strokeColor(BORDER).lineWidth(0.5).stroke();
            doc.font('Helvetica').fontSize(9).fillColor(BODY)
               .text(String(cell), xs[i] + CELL_PAD, rowY + CELL_PAD, {
                   width: cols[i].width - CELL_PAD * 2
               });
        });
        rowY += rowH;
    });

    doc.y = rowY;
    doc.moveDown(0.6);
}

// ── Signature table ────────────────────────────────────────────────────────────
function signatureTable() {
    const colW = W / 2;
    const PAD  = 10;
    const ROW_H = 30;
    const HDR_H = 28;

    const headers = [
        'Supplier (Data Processor)',
        'Customer (Data Controller)',
    ];
    const leftRows = [
        ['', 'Taylor Liesnham | Owner | Mochify'],
        ['Signature:', '___________________________'],
        ['Date:',      '___________________________'],
    ];
    const rightRows = [
        ['', '[Name] | [Title] | [Company]'],
        ['Signature:', '___________________________'],
        ['Date:',      '___________________________'],
    ];

    checkPageBreak(HDR_H + leftRows.length * ROW_H + 20);

    let y = doc.y;

    // Header row
    [0, 1].forEach(i => {
        doc.rect(L + i * colW, y, colW, HDR_H).fillColor('#FFF0F3').fill();
        doc.rect(L + i * colW, y, colW, HDR_H).strokeColor(BORDER).lineWidth(0.5).stroke();
        doc.font('Helvetica-Bold').fontSize(9).fillColor(BROWN)
           .text(headers[i], L + i * colW + PAD, y + 10, { width: colW - PAD * 2 });
    });
    y += HDR_H;

    for (let r = 0; r < leftRows.length; r++) {
        const pairs = [leftRows[r], rightRows[r]];
        pairs.forEach((pair, i) => {
            doc.rect(L + i * colW, y, colW, ROW_H).strokeColor(BORDER).lineWidth(0.5).stroke();
            if (pair[0]) {
                doc.font('Helvetica-Bold').fontSize(9).fillColor(BROWN)
                   .text(pair[0] + '  ', L + i * colW + PAD, y + 10, { continued: true });
                doc.font('Helvetica').fillColor(BODY).text(pair[1]);
            } else {
                doc.font('Helvetica').fontSize(9).fillColor(BODY)
                   .text(pair[1], L + i * colW + PAD, y + 10, { width: colW - PAD * 2 });
            }
        });
        y += ROW_H;
    }

    doc.y = y + 8;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════

heading1('Data Processing Agreement');
body('This Data Processing Agreement ("DPA") is made on the date of last signature below between the parties identified in the Signatures section.');
hr();

// ── Parties ───────────────────────────────────────────────────────────────────
heading2('Parties');
numberedItem(1, 'Taylor Liesnham trading as Mochify of Suite RA01, 195-197 Woodhouse Road, London, E17 3NU, England ("Supplier"); and');
numberedItem(2, '[Company name], a company incorporated in England and Wales under No. [Company number], whose registered office is at [Address line 1], [Address line 2], [County], [Postcode] ("Customer").');
body('(each a "party" and together the "parties")');

// ── Background ────────────────────────────────────────────────────────────────
heading2('Background');
numberedItem(3, 'The Supplier is a provider of image compression, optimisation, and format conversion services, processing image files in-memory with zero data retention on behalf of the Customer ("Services").');
numberedItem(4, 'The parties entered into an agreement for the provision of services on [DATE] ("Agreement").');
numberedItem(5, 'The parties have agreed to enter into this DPA in relation to the processing of personal data by the Supplier in the course of providing the Services. The terms of this DPA are intended to apply in addition to and not in substitution of the terms of the Agreement.');

// ── Agreement ─────────────────────────────────────────────────────────────────
heading2('Agreement');

heading3('Meanings');
numberedItem(1, 'In this DPA, the following words are defined:');

table(
    [{ header: 'Term', width: W * 0.28 }, { header: 'Definition', width: W * 0.72 }],
    [
        ['Affiliate', 'Any entity that directly or indirectly controls, or is controlled by, or is under common control with the subject entity. "Control" means direct or indirect ownership or control of more than 50% of the voting interests of the subject entity.'],
        ['Data Protection Law', '(a) All laws and regulations applicable to the Processing of Personal Data under the Agreement, including EU Directive 95/46/EC, the GDPR and laws implementing or supplementing the GDPR; and (b) to the extent applicable, the data protection or privacy laws of any other country.'],
        ['GDPR', '(a) Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 ("EU GDPR"); and (b) the EU GDPR as implemented or adopted under the laws of the United Kingdom ("UK GDPR").'],
        ['Personnel', 'In relation to a party, those of its employees, workers, agents, consultants, contractors, sub-contractors, representatives or other persons employed or engaged by that party.'],
        ['Sub-processor', 'Any entity appointed by or on behalf of the Supplier to process Personal Data on behalf of the Customer under this DPA.'],
        ['Working Day', 'Any day, other than a Saturday, Sunday, or public holiday in England and Wales.'],
    ]
);

numberedItem(2, 'Terms such as "Data Subject", "Processing", "Personal Data", "Controller", "Processor", "Supervisory Authority" and "Personal Data Breach" shall have the same meaning as ascribed to them in the Data Protection Law.');
numberedItem(3, 'In this DPA unless the context requires a different interpretation: (a) the singular includes the plural and vice versa; (b) "including" is understood to mean "including without limitation"; (c) reference to any statutory provision includes any modification or amendment of it; (d) the headings do not form part of this DPA; and (e) "writing" or "written" will include email unless otherwise stated.');

heading3('Processing Customer Personal Data');
numberedItem(4, 'For the purpose of Data Protection Law, the Customer shall be the Controller and the Supplier shall be the Processor.');
numberedItem(5, 'The Supplier and each Supplier Affiliate shall: (a) comply with all applicable Data Protection Law in the Processing of Customer Personal Data; and (b) only Process Personal Data on the Customer\'s documented instructions, unless Processing is required by applicable law.');
numberedItem(6, 'The Supplier shall take reasonable steps to ensure the reliability of Personnel who have access to Personal Data, ensuring such Personnel is subject to a strict duty of confidentiality and Processes Personal Data only for the purpose of delivering the Services.');

heading3('Security');
numberedItem(7, 'The Supplier will establish data security in relation to the Processing of Personal Data under this DPA, guaranteeing a protection level appropriate to the risk. Such measures may include: (a) pseudonymisation and encryption of Personal Data; (b) ongoing confidentiality, integrity, availability and resilience of processing systems; (c) ability to restore availability of Personal Data in a timely manner in the event of an incident; and (d) a process for regularly testing and evaluating the effectiveness of technical and organisational measures.');
numberedItem(8, 'In assessing the appropriate level of security, the Supplier shall take into account any risks presented by the Processing, in particular from a Personal Data Breach.');
numberedItem(9, 'The Supplier has laid down the technical and organisational measures in Schedule 2 of this DPA. The Supplier may implement alternative adequate measures from time to time and shall notify the Customer in writing where it has done so.');

heading3('Sub-Processors');
numberedItem(10, 'The Customer authorises the Supplier to appoint the Sub-processors listed in Schedule 3 (if any) and any new Sub-processors in accordance with the subsequent provisions.');
numberedItem(11, 'With respect to each Sub-processor, the Supplier shall: (a) carry out appropriate due diligence prior to Processing; (b) enter into a written agreement incorporating terms substantially similar to those in this DPA meeting the requirements of Article 28(3) of UK GDPR; and (c) remain fully liable to the Customer for all acts or omissions of such Sub-processor.');
numberedItem(12, 'The Supplier shall give the Customer prior written notice of the appointment of any new Sub-processor.');
numberedItem(13, 'If within 30 days of receipt of such notice the Customer notifies the Supplier of any objections: (a) the parties will work in good faith to make available a commercially reasonable change; and (b) if such a change cannot be made within 30 days, the Customer may serve written notice to terminate the Agreement to the extent that the provision of the Services is affected.');

heading3('Data Subject Rights');
numberedItem(14, 'The Supplier shall assist the Customer in implementing appropriate technical and organisational measures for the fulfilment of the Customer\'s obligation to respond to Data Subject requests under Data Protection Law.');
numberedItem(15, 'The Supplier shall: (a) promptly (and within 24 hours) notify the Customer if it receives a request from a Data Subject; and (b) fully cooperate with and assist the Customer in relation to any such request.');

heading3('Personal Data Breaches');
numberedItem(16, 'The Supplier shall: (a) notify the Customer without undue delay (no later than 72 hours) upon becoming aware of any Personal Data Breach; (b) provide sufficient information to enable the Customer to evaluate the impact; (c) provide the Customer with such assistance as reasonably requested; and (d) cooperate with the Customer to assist in the evaluation, investigation, mitigation and remediation of each Personal Data Breach.');

heading3('Data Protection Impact Assessment and Prior Consultation');
numberedItem(17, 'The Supplier shall provide reasonable assistance to the Customer with any data protection impact assessments and prior consultations with Supervisory Authorities pursuant to Articles 35 and 36 of the UK GDPR, limited to the Processing of Personal Data under this DPA.');

heading3('Return and Deletion of Personal Data');
numberedItem(18, 'The Supplier shall, within 30 days of the expiry or termination of the Agreement, delete or return all copies of Personal Data Processed on behalf of the Customer.');
numberedItem(19, 'The Supplier may retain Personal Data to the extent required by applicable law, notifying the Customer of any such requirement and ensuring the confidentiality of such data.');
numberedItem(20, 'The Customer may require the Supplier to provide written certification confirming compliance with this section.');

heading3('Audits');
numberedItem(21, 'The Supplier shall make available to the Customer on request all information necessary to demonstrate compliance with this DPA.');
numberedItem(22, 'The Supplier shall allow for and contribute to audits, including inspections, by the Customer (or any auditor mandated by the Customer), provided the Customer gives reasonable notice and makes all reasonable endeavours to avoid disruption.');
numberedItem(23, 'Such audit rights may be exercised only once in any calendar year during the term of the Agreement and for a period of 3 years following expiry or termination.');

heading3('Liability');
numberedItem(24, 'Nothing in this DPA limits or excludes either party\'s liability for death or personal injury caused by its negligence, or fraud or fraudulent misrepresentation.');
numberedItem(25, 'Subject to the preceding clause, the total liability of either party for any non-compliance with this DPA shall be subject to any limitation regarding monetary damages set forth in the Agreement.');

heading3('General Terms');
numberedItem(26, 'This DPA shall be coterminous with the Agreement.');
numberedItem(27, 'No party may assign, transfer or sub-contract to any third party the benefit and/or burden of this DPA without the prior written consent of the other party.');
numberedItem(28, 'No variation of this DPA will be valid or binding unless recorded in writing and signed by or on behalf of both parties.');
numberedItem(29, 'The Contracts (Rights of Third Parties) Act 1999 does not apply to this DPA.');
numberedItem(30, 'Any notice to be delivered under this DPA must be in writing and delivered by pre-paid first class post or hand delivery to the other party\'s registered address or place of business, or sent by email.');

heading3('Governing Law and Jurisdiction');
numberedItem(31, 'This DPA will be governed by and interpreted according to the law of England and Wales and all disputes shall be subject to the exclusive jurisdiction of the English and Welsh courts.');

// ── Signatures ────────────────────────────────────────────────────────────────
doc.addPage();
heading2('Signatures');
signatureTable();

// ── Schedule 1 ────────────────────────────────────────────────────────────────
hr();
heading2('Schedule 1 — Processing Activities');
doc.font('Helvetica-Bold').fontSize(10).fillColor(BROWN).text('Nature and purpose of Processing:', L, doc.y, { continued: true });
doc.font('Helvetica').fillColor(BODY).text(' The Supplier will Process Personal Data as necessary to provide the Services pursuant to the Agreement, and as further instructed by the Customer.');
doc.moveDown(0.5);
doc.font('Helvetica-Bold').fontSize(10).fillColor(BROWN).text('Types of Personal Data:', L, doc.y);
doc.moveDown(0.2);
bullet('Image file metadata, which may incidentally include EXIF data such as geolocation, device identifiers, and photographer information embedded within uploaded image files.');
doc.font('Helvetica-Bold').fontSize(10).fillColor(BROWN).text('Categories of Data Subject:', L, doc.y);
doc.moveDown(0.2);
bullet('Customers of the Customer (including their staff)');
bullet('Other people that the Customer deals with');
doc.font('Helvetica-Bold').fontSize(10).fillColor(BROWN).text('Obligations and rights of the Customer:', L, doc.y, { continued: true });
doc.font('Helvetica').fillColor(BODY).text(' Set out in the Agreement and this DPA.');

// ── Schedule 2 ────────────────────────────────────────────────────────────────
heading2('Schedule 2 — Technical and Organisational Measures');
body('The Supplier will conduct the activities covered by this DPA in compliance with its Information Security Policy and data protection policies, available online at: https://mochify.app/privacy');
body('The Supplier also has the following technical and organisational measures in place:');
bullet('All uploaded image files are processed entirely in-memory and are never written to disk or retained after processing is complete, ensuring zero data persistence.');
bullet('All data in transit is encrypted using HTTPS/TLS. Server access is restricted to authorised personnel only, with access controls and secure authentication in place.');

// ── Schedule 3 ────────────────────────────────────────────────────────────────
heading2('Schedule 3 — Sub-Processors');
body('The Customer agrees that the Supplier may sub-contract certain obligations under this DPA to the following Sub-processors:');
doc.font('Helvetica-Oblique').fontSize(10).fillColor(BODY).text('None at the date of this agreement.', L, doc.y, { width: W });

// ── Done ──────────────────────────────────────────────────────────────────────
doc.end();
stream.on('finish', () => console.log('✓ Written to', OUT_FILE));
stream.on('error', err => { console.error(err); process.exit(1); });
