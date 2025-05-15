const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

// Create Users table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `);

    // Create Products table
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
        
            description TEXT NOT NULL,
            image_url TEXT NOT NULL
        );
    `);
    // Create cart_items table
    db.run(`
         CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

    // Seed 12 products if table is empty
    db.get(`SELECT COUNT(*) as count FROM products`, (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare(`
                INSERT INTO products (name, description, image_url)
                VALUES (?, ?, ?)
            `);
            for (let i = 1; i <= 12; i++) {
                stmt.run(
                    `Product ${i}`,
                    `This is a great product number ${i}. Highly recommended!`,
                    `https://dummyimage.com/600x400/000/fff&text=Product+${i}`
                );
            }
            stmt.finalize();
        }
    });
});

module.exports = db;

