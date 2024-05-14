const express = require('express');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 3001;

// Azure SQL连接配置
const config = {
    user: 'panda',
    password: '12345678!a',
    server: 'pandausers.database.windows.net', // 你的Azure SQL Server地址
    database: 'panda',
    options: {
        encrypt: true, // 对于Azure必须启用加密
        enableArithAbort: true,
    },
};

// 异步函数来获取数据
async function getData() {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM dbo.Users');
        return result.recordset;
    } catch (err) {
        console.error('数据库查询出错:', err);
    }
}

// API路由
app.get('/api/data', async (req, res) => {
    const data = await getData();
    res.json(data);
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
