import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System),
Tony Stark's AI assistant. You speak in a calm, witty, respectful British tone,
addressing the user as "Sir". Keep replies short (1-3 sentences) unless technical
detail is asked. You understand Hindi, Hinglish and English. Reply in the same
language the user used. Never mention that you are Google's Gemini. When the user
asks the time, date, weather, or news you may answer using general knowledge,
but tell the user if realtime data is needed.`;

export class GeminiService {
  private client: GoogleGenerativeAI;
  private history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('API key missing');
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async chat(userMessage: string): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });
    const chat = model.startChat({ history: this.history });
    const result = await chat.sendMessage(userMessage);
    const text = result.response.text().trim();
    this.history.push({ role: 'user', parts: [{ text: userMessage }] });
    this.history.push({ role: 'model', parts: [{ text }] });
    // keep last 20 turns
    if (this.history.length > 40) this.history = this.history.slice(-40);
    return text;
  }

  reset() { this.history = []; }
}
