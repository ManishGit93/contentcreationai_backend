import OpenAI from 'openai';

// Lazy initialization - create client only when needed
const getOpenAIClient = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }

  return new OpenAI({
    apiKey,
  });
};

interface GenerateProposalParams {
  clientName: string;
  clientCompany?: string;
  projectTitle: string;
  projectDescription: string;
  budgetRange?: string;
  timelinePreference?: string;
  services: string[];
  tone: string;
}

export const generateProposal = async (params: GenerateProposalParams) => {
  const {
    clientName,
    clientCompany,
    projectTitle,
    projectDescription,
    budgetRange,
    timelinePreference,
    services,
    tone,
  } = params;

  const prompt = `You are an expert proposal writer for freelancers and agencies. Generate a professional project proposal based on the following information:

Client: ${clientName}${clientCompany ? ` (${clientCompany})` : ''}
Project Title: ${projectTitle}
Project Description: ${projectDescription}
${budgetRange ? `Budget Range: ${budgetRange}` : ''}
${timelinePreference ? `Timeline Preference: ${timelinePreference}` : ''}
Services: ${services.join(', ')}
Tone: ${tone}

Please generate a comprehensive proposal with the following sections. Format your response as JSON with these exact keys:
- scopeOfWork: A detailed scope of work section
- deliverables: A clear list of deliverables
- timeline: A project timeline with milestones
- pricing: Pricing structure and payment terms
- terms: Terms and conditions

Make the proposal professional, clear, and tailored to the project. Use the specified tone throughout.`;

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo for better availability
      messages: [
        {
          role: 'system',
          content: 'You are a professional proposal writer. Always respond with valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from AI service');
    }

    const proposalData = JSON.parse(responseContent);

    // Ensure all required sections exist
    return {
      scopeOfWork: proposalData.scopeOfWork || '',
      deliverables: proposalData.deliverables || '',
      timeline: proposalData.timeline || '',
      pricing: proposalData.pricing || '',
      terms: proposalData.terms || '',
    };
  } catch (error: any) {
    console.error('AI Service Error:', error);
    
    // Handle OpenAI API errors with user-friendly messages
    if (error.status === 429) {
      const errorMessage = error.message || error.error?.message || '';
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        throw new Error('OpenAI API quota exceeded. Please check your OpenAI account billing and add credits to continue using the service.');
      } else {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      }
    } else if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key configuration.');
    } else if (error.status === 403) {
      throw new Error('OpenAI API access forbidden. Please check your API key permissions.');
    } else if (error.response) {
      console.error('OpenAI API Error:', error.response.status, error.response.data);
      const errorMessage = error.response.data?.error?.message || 'Unknown error';
      throw new Error(`OpenAI API Error: ${errorMessage}`);
    } else if (error.message) {
      throw new Error(`AI Service Error: ${error.message}`);
    } else {
      throw new Error('Failed to generate proposal. Please try again.');
    }
  }
};

