import express from 'express';

const app = express();
app.get('/', (req, res) => {
  res.send('Welcome to Node Babel');
});

app.listen(5000, () => {
});
