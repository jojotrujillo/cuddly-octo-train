const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('./ZipperPlans.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the ZipperPlans database.');
});

app.use(cors());

// Get dropdown configs
app.get('/api/DropdownConfigs', (req, res) => {
	db.all('SELECT * FROM DropdownConfigs', (err, rows) => {
			if (err) {
					// Handle error
					console.error(err);
					return res.status(500).json({ error: 'Internal server error' });
			}

			// Group rows by categoryName
			const groupedConfigs = {};
			rows.forEach(row => {
					if (!row.categoryName) {
							groupedConfigs[row.dropdownDisplayType] = [];
							return;
					}

					groupedConfigs[row.dropdownDisplayType].push({
							display: row.itemDisplayName,
							value: row.dropdownConfigKey
					});
			});

			// Map groupedConfigs to IDropdownConfig array
			const dropdownConfigs = Object.keys(groupedConfigs).map(categoryName => ({
					categoryName: categoryName,
					dropdownItems: groupedConfigs[categoryName]
			}));

			res.json(dropdownConfigs);
	});
});


// Get a single Activer Directory user by pernr
app.get('/api/Users/GetUser/:pernr', (req, res) => {
	const { pernr } = req.params;

	db.get('SELECT * FROM ActiveDirectoryUsers WHERE Pernr = ?', [pernr], (err, row) => {
		if (err) {
			console.error(err.message);
			res.status(500).send('Internal server error');
		} else if (!row) {
			res.status(404).send('User not found');
		} else {
			// Convert json keys to camel case
			const newRow = {};
			Object.keys(row).forEach(key => {
				const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
				newRow[camelCaseKey] = row[key];
			});

			setTimeout((() => {
				res.send(newRow);
			}), 2000);
		}
	});
});

app.get('/api/ResourcePlans/:resourcePlanKey/Contacts', (req, res) => {
	db.all('SELECT * FROM ResourcePlanContacts', (err, rows) => {
		if (err) {
			console.error(err.message);
			res.status(500).send('Internal server error');
		} else {
			// Convert json keys to camel case
			rows = rows.map(row => {
				const newRow = {};
				Object.keys(row).forEach(key => {
					const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
					newRow[camelCaseKey] = row[key];
				});
				return newRow;
			});

			res.send(rows);
		}
	});
});

app.post('/api/ResourcePlans/:resourcePlanKey/Contact', (req, res) => {
	const { name, price } = req.body;
	if (!name || !price) {
		res.status(400).send('Name and price are required');
	} else {
		const sql = 'INSERT INTO products(name, price) VALUES (?, ?)';
		db.run(sql, [name, price], function (err) {
			if (err) {
				console.error(err.message);
				res.status(500).send('Internal server error');
			} else {
				const id = this.lastID;
				res.status(201).send({ id, name, price });
			}
		});
	}
});

app.put('/api/ResourcePlans/:resourcePlanKey/Contact/:resourcePlanContactKey', (req, res) => {
	const { id } = req.params;
	const { name, price } = req.body;
	if (!name || !price) {
		res.status(400).send('Name and price are required');
	} else {
		const sql = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
		db.run(sql, [name, price, id], function (err) {
			if (err) {
				console.error(err.message);
				res.status(500).send('Internal server error');
			} else if (this.changes === 0) {
				res.status(404).send('Product not found');
			} else {
				res.status(200).send({ id, name, price });
			}
		});
	}
});

app.delete('/api/ResourcePlans/:resourcePlanKey/Contact/:resourcePlanContactKey', (req, res) => {
	const { id } = req.params;
	db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
		if (err) {
			console.error(err.message);
			res.status(500).send('Internal server error');
		} else if (this.changes === 0) {
			res.status(404).send('Product not found');
		} else {
			res.status(204).send();
		}
	});
});

// Start the server
app.listen(port, () => {
	console.log(`Server listening on port ${port}.`);
});
