const onProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';
const onStaging = process.env.NEXT_PUBLIC_APP_ENV === 'staging';
const onDevelopment = process.env.NEXT_PUBLIC_APP_ENV === 'development';
const onProductionOrStaging = onProduction || onStaging;

export const appConfig = {
  env: {
    onDevelopment,
    onProductionOrStaging,
    onProduction,
    onStaging,
  },
  resumeInputFormStorageName: 'resume-input-form',
  formalityInputFormStorageName: 'formality-input-form',
  openAIEndpoint: 'https://api.openai.com/v1/chat/completions',
};
