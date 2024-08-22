import { Request, Response, route } from './httpSupport'

async function GET(req: Request): Promise<Response> {
    const secrets = req.secret || {};
    const queries = req.queries;
    console.log(JSON.stringify(secrets))
    const apiKey = (secrets.apiKey) ? secrets.apiKey : 'sk-qVBlJkO3e99t81623PsB0zHookSQJxU360gDMooLenN01gv2';
    const model = (queries.model) ? queries.model[0] : 'gpt-4o';
    const chatQuery = (queries.chatQuery) ? queries.chatQuery[0] : 'Who are you?';
    let result = '';

    try {
        const response = await fetch('https://api.red-pill.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: `${chatQuery}` }],
                model: `${model}`,
            })
        });
        const responseData = await response.json();
        result = (responseData.error) ? responseData.error : responseData.choices[0].message.content
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        result = error;
    }

    return new Response(JSON.stringify({'message': result}))
}

async function POST(req: Request): Promise<Response> {
    return new Response('Not Implemented')
}

export default async function main(request: string) {
    return await route({ GET, POST }, request)
}
