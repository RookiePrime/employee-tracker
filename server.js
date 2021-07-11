const express = require('express');
const db = require('./config/connection');
const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require('./routes/apiRoutes');

const { mainMenu } = require('./app');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Routing using apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        mainMenu(PORT);
    });
});
