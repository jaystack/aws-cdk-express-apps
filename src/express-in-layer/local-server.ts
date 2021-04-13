import { app } from './app';


export const server = app.listen(5000, () => {
    console.log('Server started at', server.address())
})