const express = require('express')

const app = express();

app.get('/', (req, res) => {
    return res.json({
        "status": "This is also success message"
    })
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))