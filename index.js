import 'dotenv/config';
import app from './src/app.js';

const port = PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
