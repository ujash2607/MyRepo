const express = require("express");
const app = express();

const port = 3002;

app.use(express.json());
const router = require("./router/route");


app.use('/', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})