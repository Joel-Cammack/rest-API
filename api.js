const fs = require('fs/promises')
const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const { v4: uuid } = require('uuid');
const { response } = require('express');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/me', (req, res) => {
    const tops = ['black', 'white', 'gray'];
    const jeans = ['blue', 'green', 'orange'];
    const shoes = ['yellow', 'red', 'gray'];
    
    res.json({
        top: _.sample(tops),
        jeans: _.sample(jeans),
        shoes: _.sample(shoes)
    });
});

app.get('/comments/:id', async(req, res) => {
    const id = req.params.id;
    let content;

    try {
        content = await fs.readFile(`data/comments/${id}.txt`, 'utf-8');
    } catch (err) {
        return res.sendStatus(404);
    }
    res.json({
        content: content
    });
});

app.post('/comments', async (req, res) => {
    const id = uuid();
    const content = req.body.content;
    
    if(!content) {
        return res.sendStatus(400);
    }
    
    await fs.mkdir('data/comments', { recursive: true });
    await fs.writeFile(`data/comments/${id}.txt`, content);

    res.status(201).json({
        id: id
    }); 
});

app.listen(3000, () => console.log('API server is running...'));

