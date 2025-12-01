import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
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
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to generate proposal. Please try again.');
  }
};

