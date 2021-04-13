import { Handler } from 'aws-lambda';


export const handle: Handler = async (event, context) => {
    return { echo: true, event, context }
}