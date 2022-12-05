//Starter express server op, med port 3000

const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log('Server is listening on port 3000');
});