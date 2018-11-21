const pool = new sql.ConnectionPool({
    user: '...',
    password: '...',
    server: 'localhost',
    database: '...'
})
 
pool.connect(err => {
    // ...
})