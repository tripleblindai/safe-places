const express = require('express');
const path = require('path');

const app = express();
const PORT = 8009;
app.use(express.static('public'));

app.get('/:name/index.html', (req, res) => {
	res.sendFile(path.join(__dirname, `/${req.params.name}`, 'index.html'), {}, (err) => {
		if (err) {
			next(err);
		} else {
			console.log('Sent:', req.params.name, 'page');
		}
	})
});

app.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, '/', 'index.html'), {}, (err) => {
		if (err) {
			next(err)
		} else {
			console.log('Sent: index file');
		}
	})
});

app.listen(PORT, () => console.log(`Safe Places app listening at http://localhost:${PORT}`))