// import { action } from "./_generated/server";
// import { v } from "convex/values";

// import OpenAI from "openai";
// import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export const generateAudioAction = action({
//   args: { input: v.string(), voice: v.string() },
//   handler: async (_, { voice, input }) => {
//     const mp3 = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: voice as SpeechCreateParams['voice'],
//       input,
//     });

//     const buffer = await mp3.arrayBuffer();
    
//     return buffer;
//   },
// });

// export const generateThumbnailAction = action({
//   args: { prompt: v.string() },
//   handler: async (_, { prompt }) => {
//     const response = await openai.images.generate({
//       model: 'dall-e-3',
//       prompt,
//       size: '1024x1024',
//       quality: 'standard',
//       n: 1,
//     })

//     const url = response.data[0].url;

//     if(!url) {
//       throw new Error('Error generating thumbnail');
//     }

//     const imageResponse = await fetch(url);
//     const buffer = await imageResponse.arrayBuffer();
//     return buffer;
//   }
// })



import { action } from "./_generated/server";
import { v } from "convex/values";

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY!;
const ELEVEN_LABS_VOICE_ID = process.env.ELEVEN_LABS_VOICE_ID!; // Set your preferred default voice ID

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.optional(v.string()) },
  handler: async (_, { voice, input }) => {
    const voiceId = voice || ELEVEN_LABS_VOICE_ID;
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_LABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: input,
        model_id: "eleven_monolingual_v1", // or "eleven_multilingual_v1"
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    return buffer;
  },
});


export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'jpeg');

    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Accept': 'application/json',
        // ❗ DO NOT manually set Content-Type for FormData — let the browser handle it
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stability API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const base64Image = data.image;

    if (!base64Image) {
      throw new Error('No image returned from Stability API');
    }

    const buffer = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0)).buffer;
    return buffer;
  },
});