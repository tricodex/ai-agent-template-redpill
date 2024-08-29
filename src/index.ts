import { Request, Response, route } from './httpSupport'

async function GET(req: Request): Promise<Response> {
    const secrets = req.secret || {};
    const queries = req.queries;
    const apiKey = (secrets.apiKey) ? secrets.apiKey : 'sk-qVBlJkO3e99t81623PsB0zHookSQJxU360gDMooLenN01gv2';
    // Choose from any model listed here https://docs.red-pill.ai/get-started/supported-models
    const model = (queries.model) ? queries.model[0] : 'gpt-4o';
    const chatQuery = (queries.chatQuery) ? queries.chatQuery[0] : 'Who are you?';
    let result = {
        message: ''
    };

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
        result.message = (responseData.error) ? responseData.error : responseData.choices[0].message.content
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        result.message = error as string;
    }

    return new Response(JSON.stringify(result))
}

async function POST(req: Request): Promise<Response> {
    return new Response(JSON.stringify({message: 'POST Not Implemented'}))
}

export default async function main(request: string) {
    return await route({ GET, POST }, request)
}
