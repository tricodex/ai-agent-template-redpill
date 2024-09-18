import { expect, test, vi } from 'vitest'
import { timeout } from 'hono/timeout'
import { app } from '../src/'

// Set Testing env secrets
const secretSalt = JSON.stringify({apiKey: 'sk-qVBlJkO3e99t81623PsB0zHookSQJxU360gDMooLenN01gv2'})
vi.stubEnv('secret', secretSalt)

test('GET Test: Pass chatQuery through URL Query', async () => {
  let chatQuery = 'Who are you?'
  let model = 'gpt-4o'
  const resp = await app.request(encodeURI(`/?chatQuery=${chatQuery}&model=${model}`))
  expect(resp.status).toBe(200)
  expect(resp.headers.get('content-type')?.toLowerCase()).toBe('application/json; charset=utf-8')
  const data = await resp.json()
  console.log(data)
  expect(data).toHaveProperty('model')
  expect(data).toHaveProperty('chatQuery')
  expect(data).toHaveProperty('message')
})

test('POST Test: Pass chatQuery and model through body of POST request', async () => {
  const input = { chatQuery: 'What is FooBar?', model: 'gpt-4o' }
  const resp = await app.request('/', {
    method: 'POST',
    body: JSON.stringify(input),
  }, timeout(60000))
  expect(resp.status).toBe(200)
  expect(resp.headers.get('content-type')?.toLowerCase()).toBe('application/json; charset=utf-8')
  const data = await resp.json()
  console.log(data)
  expect(data).toHaveProperty('model')
  expect(data).toHaveProperty('chatQuery')
  expect(data).toHaveProperty('message')
})
