const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// 2. Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'PSSMS'
});

db.connect(err => {
    if (err) console.error('Database connection failed:', err);
    else console.log('Connected to PSSMS Database');
});

// --- 10. AUTHENTICATION ---
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'User created' });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'User not found' });
        bcrypt.compare(password, results[0].password, (err, same) => {
            if (same) res.json({ user: results[0] });
            else res.status(401).json({ message: 'Invalid password' });
        });
    });
});

// --- 8. CRUD OPERATIONS ---

// 1. CAR
app.post('/api/car', (req, res) => {
    const { PlateNumber, DriverName, PhoneNumber } = req.body;
    const sql = 'INSERT INTO car (PlateNumber, DriverName, PhoneNumber) VALUES (?, ?, ?)';
    db.query(sql, [PlateNumber, DriverName, PhoneNumber], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Car registered successfully!' });
    });
});

// 2. PARKING SLOT
app.post('/api/parkingslot', (req, res) => {
    const SlotNumber = parseInt(req.body.SlotNumber);
    const SlotStatus = req.body.SlotStatus;
    if (isNaN(SlotNumber)) return res.status(400).json({ message: "Slot Number must be an integer" });

    const sql = 'INSERT INTO parkingslot (SlotNumber, SlotStatus) VALUES (?, ?)';
    db.query(sql, [SlotNumber, SlotStatus], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Slot created successfully" });
    });
});

app.get('/api/parkingslot', (req, res) => {
    db.query('SELECT * FROM parkingslot', (err, results) => res.json(results));
});

// 3. PARKING RECORD (Handles 404s by supporting plural and singular)
app.get(['/api/parkingrecord', '/api/parkingRecords'], (req, res) => {
    const { plateNumber } = req.query;
    if (plateNumber) {
        // Search for active sessions only (Requirement 12)
        const sql = 'SELECT * FROM parkingrecord WHERE PlateNumber = ? AND ExitTime IS NULL ORDER BY EntryTime DESC';
        db.query(sql, [plateNumber], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results); // Returns array to match your res.data[0] frontend logic
        });
    } else {
        db.query('SELECT * FROM parkingrecord', (err, results) => res.json(results));
    }
});

app.post('/api/parkingrecord', (req, res) => {
    const { EntryTime, SlotNumber, PlateNumber } = req.body;
    db.query('INSERT INTO parkingrecord (EntryTime, SlotNumber, PlateNumber) VALUES (?, ?, ?)', 
    [EntryTime, SlotNumber, PlateNumber], (err) => {
        if (err) return res.status(500).json(err);
        db.query('UPDATE parkingslot SET SlotStatus = "Occupied" WHERE SlotNumber = ?', [SlotNumber]);
        res.json({ message: 'Entry recorded' });
    });
});

app.delete('/api/parkingrecord/:id', (req, res) => {
    db.query('DELETE FROM parkingrecord WHERE RecordID=?', [req.params.id], (err) => res.json({ message: 'Deleted' }));
});

// --- 12. PAYMENT & BILLING ---
app.post('/api/payments', (req, res) => {
    const { RecordID, AmountPaid, SlotNumber } = req.body;
    const exitTime = new Date(); // Current time for calculation
    
    // 1. Insert Payment
    const paymentSql = `INSERT INTO payment (AmountPaid, PaymentDate, RecordID) VALUES (?, NOW(), ?)`;
    db.query(paymentSql, [AmountPaid, RecordID], (err) => {
        if (err) return res.status(500).json({ error: "Payment Failed", details: err });

        // 2. Get Entry Time to calculate exact duration
        db.query('SELECT EntryTime FROM parkingrecord WHERE RecordID = ?', [RecordID], (err, results) => {
            if (err || results.length === 0) return res.status(500).json({ error: "Record not found" });

            const entryTime = new Date(results[0].EntryTime);
            // Requirement 12: 500RWF/hr (Any part of hour = full hour)
            const durationHours = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));

            // 3. Update Record with Exit info
            db.query('UPDATE parkingrecord SET ExitTime = NOW(), Duration = ? WHERE RecordID = ?', 
            [durationHours, RecordID], (err) => {
                
                // 4. Free up the slot
                db.query('UPDATE parkingslot SET SlotStatus = "Available" WHERE SlotNumber = ?', [SlotNumber], () => {
                    // IMPORTANT: Return bill data so the Invoice works!
                    res.json({ 
                        message: 'Payment recorded and slot freed',
                        bill: {
                            exitTime: exitTime,
                            durationHours: durationHours
                        }
                    });
                });
            });
        });
    });
});

// --- 11. REPORTS ---
app.get('/api/reports/daily', (req, res) => {
    const sql = `
        SELECT pr.PlateNumber, pr.EntryTime, pr.ExitTime, pr.Duration, p.AmountPaid 
        FROM parkingrecord pr
        JOIN payment p ON pr.RecordID = p.RecordID
        WHERE DATE(p.PaymentDate) = CURDATE()`;
    db.query(sql, (err, results) => res.json(results));
});

const PORT = 3001;
app.listen(PORT, () => console.log(`SmartPark Backend running on port ${PORT}`));