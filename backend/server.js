const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/athletes', require('./routes/athletes'));

app.get('/', (req, res) => res.json({ message: 'AthleteIQ API running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n✅ Server running on http://localhost:${PORT}\n   No MongoDB needed — using local JSON storage\n`));
