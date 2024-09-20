import '@phala/wapo-env'
import { Hono } from 'hono/tiny'
import { handle } from '@phala/wapo-env/guest'

export const app = new Hono()

const systemPrompt = `You are a service validity assessor for a decentralized AI Fiverr-like platform. Your task is to evaluate digital services based on provided requirements. Here are the general requirements:
1. The content must be original and not plagiarized.
2. The content must be free of grammatical and spelling errors.
3. The content must be coherent and well-structured.
4. The content must be relevant to the specified topic or service.
Assess the provided content against both these general requirements and the specific requirements provided by the service requirer. If all requirements are met, return a positive assessment. If not, explain why the content fails to meet the requirements.`

async function getAIVerification(apiKey: string, model: string, requirements: string, content: string) {
  try {
    const response = await fetch('https://api.red-pill.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Specific requirements: ${requirements}\n\nContent to assess: ${content}` }
        ],
        model: model,
      })
    });
    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching AI verification:', error)
    return `Error: ${error}`
  }
}

app.post('/verify-service', async (c) => {
  let vault: Record<string, string> = {}
  try {
    vault = JSON.parse(process.env.secret || '')
  } catch (e) {
    console.error(e)
    return c.json({ error: "Failed to parse secrets" }, 500)
  }

  const apiKey = vault.redpillApiKey
  if (!apiKey) {
    return c.json({ error: "RedPill API key not found in secrets" }, 500)
  }

  const data = await c.req.json()
  const { requirements, content, model = 'gpt-4o' } = data

  const verificationResult = await getAIVerification(apiKey, model, requirements, content)

  return c.json({
    success: true,
    verificationResult
  })
})

export default handle(app)