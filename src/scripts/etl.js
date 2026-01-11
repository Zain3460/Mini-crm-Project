const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { Customer } = require('../models');
const { normalizeTRPhone, normalizeEmail } = require('../services/customerService');

async function runETL() {
    const filePath = path.join(__dirname, '../../data/customers.xlsx');
    if (!fs.existsSync(filePath)) {
        console.error('Excel file not found at:', filePath);
        return;
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const report = {
        total: data.length,
        success: 0,
        failed: 0,
        duplicates: 0,
        errors: []
    };

    for (const row of data) {
        try {
            // Alternatif kolon isimleri desteği
            let fullName = row['Ad Soyad'] || row['Müşteri'] || row['Name'] || row['Full Name'] || '';
            fullName = fullName.replace(/[“”"']/g, '').trim();
            
            let firstName = '';
            let lastName = '';

            if (fullName) {
                const parts = fullName.split(' ');
                if (parts.length > 1) {
                    lastName = parts.pop();
                    firstName = parts.join(' ');
                } else {
                    firstName = fullName;
                    lastName = '';
                }
            } else {
                firstName = row['Ad'] || row['First Name'] || '';
                lastName = row['Soyad'] || row['Last Name'] || '';
            }

            const phone = normalizeTRPhone(row['Telefon'] || row['Phone'] || row['GSM']);
            const email = normalizeEmail(row['Email'] || row['E-posta'] || row['Mail']);
            const address = row['Adres'] || row['Address'] || null;

            if (!firstName) {
                throw new Error('First name is missing');
            }

            // Gelişmiş Duplicate Kontrolü
            let existing = null;
            if (phone) {
                existing = await Customer.findOne({ where: { phone } });
            }
            if (!existing && email) {
                existing = await Customer.findOne({ where: { email } });
            }
            // İsim ve soyisim ile kontrol (opsiyonel ama müşteri talebi için)
            if (!existing && firstName && lastName) {
                existing = await Customer.findOne({ where: { firstName, lastName } });
            }

            if (existing) {
                report.duplicates++;
                continue;
            }

            await Customer.create({
                firstName,
                lastName,
                phone,
                email,
                address,
                isActive: true
            });

            report.success++;
        } catch (error) {
            report.failed++;
            report.errors.push({ row, error: error.message });
        }
    }

    console.log('ETL Report:', JSON.stringify(report, null, 2));
    const reportPath = path.join(__dirname, '../../data/etl_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
}

if (require.main === module) {
    runETL().then(() => process.exit(0)).catch(err => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = runETL;
