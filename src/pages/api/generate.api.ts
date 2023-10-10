import { captureException } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { GenerateApiDTO } from '~/common/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { jobDescription, resume, formality } = JSON.parse(req.body) as GenerateApiDTO;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an assistant that designed to write ${formality.toLowerCase()} cover letters for job hunters.`,
        },
        {
          role: 'user',
          content: `I need help crafting a ${formality.toLowerCase()} cover letter for a job application. I'll send you the job description and my resume. Please use that context to create a compelling cover letter highlighting my qualifications and fitting the job well.`,
        },
        {
          role: 'user',
          content: `Here is the job description:\n${jobDescription.trim()}`,
        },
        {
          role: 'user',
          content: `Here is my resume:\n${resume.trim()}`,
        },
      ],
      model: 'gpt-4',
      temperature: 0,
    });

    const coverLetter = response.choices[0].message.content;

    if (!coverLetter) {
      throw new Error('The content of the message is empty.');
    }

    res.status(200).json({ coverLetter });
  } catch (error) {
    captureException(error, { extra: { jobDescription, resume, formality } });
    res.status(500).json({ error: 'Unable to generate your cover letter.' });
  }
};

export default handler;
