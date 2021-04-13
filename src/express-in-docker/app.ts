import express from 'express'
import jsons from 'json-stringify-safe'
export const app = express()

app.get('/', (req, res) => {
    res.json({ req: JSON.parse(jsons(req)) })
})

app.get('/hello', (req, res) => {
    res.json({
        hello: 'serverless world',
        ok: 1,
    })
})

app.use('*', (req, res) => {
    res.json({ catchAll: true, req: JSON.parse(jsons(req)) })
})



