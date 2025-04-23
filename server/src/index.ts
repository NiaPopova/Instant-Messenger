import * as express from 'express';

const app = express();

app.listen(4002, () => {
    console.log('Server is listening on port 4002')
});