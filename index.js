require('dotenv').config();
const app = require('./src/app.js');

const { PORT } = process.env;
const port = PORT || 3000; 
app.listen(port, () => console.log(`Server running on port ${port}`));
