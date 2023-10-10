import useSWRMutation from 'swr/mutation';
import { GenerateApiDTO, GenerateAPIResponse } from '~/common/types';

const generateCoverLetter = async (url: string, { arg }: { arg: GenerateApiDTO }): Promise<GenerateAPIResponse> => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });

  return response.json();
};

export const useGenerateCoverLetter = () => {
  return useSWRMutation<GenerateAPIResponse, unknown, string, GenerateApiDTO>('/api/generate', generateCoverLetter);
};
