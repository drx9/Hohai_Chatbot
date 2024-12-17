import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const expertiseKeywords = ['developer', 'designer', 'plumber', 'electrician'];
    let responseMessage = '';

    // Check if the message contains expertise keywords
    const matchedKeyword = expertiseKeywords.find((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (matchedKeyword) {
      // Fetch professionals from Firestore matching the expertise
      const professionalsRef = collection(db, 'professionals');
      const q = query(professionalsRef, where('profession', '==', matchedKeyword));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const professionals = querySnapshot.docs.map((doc) => doc.data());
        responseMessage = `Here are some **${matchedKeyword}s** you might be interested in:\n\n` +
          professionals
            .map((prof) => `- **${prof.name}**: ${prof.contact}`)
            .join('\n');
      } else {
        responseMessage = `Sorry, I couldn't find any **${matchedKeyword}s** in the database.`;
      }
    } else {
      // Fallback to Gemini API if no expertise keyword matches
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Add instructions for Gemini to keep answers short and formatted
      const structuredPrompt = `
      You are an assistant that provides concise, plain text responses. 
      Do not use any special formatting such as:
      - Markdown (e.g., **bold**, *italics*, etc.)
      - Symbols like -, *, or #
      - Lists or bullet points
      
      Provide your responses in a simple, clean text format.
      
      User's query: "${message}"
      `;
      
      

      const result = await model.generateContent(structuredPrompt);
      const geminiResponse = result.response.text();

      responseMessage = geminiResponse || "Sorry, I couldn't understand that. Can you clarify?";
    }

    return Response.json({ response: responseMessage });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json(
      { response: 'Sorry, something went wrong on the server.' },
      { status: 500 }
    );
  }
}
