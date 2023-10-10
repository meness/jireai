import { Transition } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import React, { lazy, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form'; // Import React Hook Form
import * as yup from 'yup';
import { Formality } from '~/common/enums';
import { LabelValueOption } from '~/common/types';
import { DonatePopup } from '~/components';
import { appConfig } from '~/config';
import { extractPDFText, stripHTMLTags } from '~/helpers';
import { useGenerateCoverLetter } from '~/hooks';

const Editor = lazy(async () => {
  const mod = await import('~/components/editor.component');

  return { default: mod.Editor };
});

const generateFormSchema = yup
  .object({
    jobDescription: yup.string().trim().transform(stripHTMLTags).required(),
    resume: yup.string().trim().transform(stripHTMLTags).required(),
    formality: yup.string().lowercase().oneOf<Formality>([Formality.CASUAL, Formality.FORMAL]).required(),
  })
  .required();

const AppPage = () => {
  const { t } = useTranslation();

  const [coverLetter, setCoverLetter] = useState('');
  const resumeUploadInputRef = useRef<HTMLInputElement>(null);

  const { isMutating: isGenerating, trigger: generateCoverLetter } = useGenerateCoverLetter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(generateFormSchema),
  });

  const formalityOptions: LabelValueOption<Formality>[] = [
    { label: t('app:formal_label'), value: Formality.FORMAL },
    { label: t('app:casual_label'), value: Formality.CASUAL },
  ];

  useEffect(() => {
    // Initialize form with cookies
    reset({
      formality:
        (localStorage.getItem(appConfig.formalityInputFormStorageName)
          ? (localStorage.getItem(appConfig.formalityInputFormStorageName) as Formality)
          : undefined) ?? Formality.FORMAL,
      resume: localStorage.getItem(appConfig.resumeInputFormStorageName) ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Save form state in cookies
    watch((value) => {
      localStorage.setItem(appConfig.formalityInputFormStorageName, value.formality ?? 'formal');
      localStorage.setItem(appConfig.resumeInputFormStorageName, value.resume ?? '');
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const onSubmit = async ({ jobDescription, resume, formality }: yup.InferType<typeof generateFormSchema>) => {
    try {
      const response = await generateCoverLetter({ formality, jobDescription, resume });
      setCoverLetter(response.coverLetter);
    } catch (error) {
      // TODO Catch exception
    }
  };

  const handleUploadResumeInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const pdfText = await extractPDFText(file);

        setValue('resume', pdfText, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      } catch (error) {
        // TODO Catch exception
      }
    }
  };

  return (
    <div>
      <NextSeo title={t('app:title')} />
      <h1 className="mb-4 text-3xl font-semibold">Cover Letter Generator</h1>
      <div className="container relative mx-auto">
        <Transition
          appear
          className="absolute left-0 right-0"
          show={coverLetter.length === 0}
          enter="transition-opacity duration-300 ease-in-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-1000 ease-in-out transition-[opacity,transform]"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="-translate-x-full opacity-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Editor
                  initialValue={getValues('jobDescription')}
                  {...register('jobDescription')}
                  id="job-description"
                  disabled={isGenerating}
                  init={{
                    placeholder: t('app:copy_and_paste_the_job_description_here_label'),
                  }}
                  onEditorChange={(changedValue) => {
                    setValue('jobDescription', changedValue);
                  }}
                />
                {errors.jobDescription && <p className="text-red-600">{errors.jobDescription.message}</p>}
              </div>
              <div>
                <Editor
                  initialValue={getValues('resume')}
                  disabled={isGenerating}
                  {...register('resume')}
                  id="resume"
                  onEditorChange={(changedValue) => {
                    setValue('resume', changedValue);
                  }}
                  init={{ placeholder: t('app:write_your_resume_here_label') }}
                />
                {errors.resume && <p className="text-red-600">{errors.resume.message}</p>}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleUploadResumeInputChange}
                  className="mt-2"
                  hidden
                  ref={resumeUploadInputRef}
                />
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => {
                    resumeUploadInputRef.current?.click();
                  }}
                  className="mt-2 rounded bg-blue-500 p-2 capitalize text-white">
                  {t('app:use_your_pdf_resume_label')}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="formality"
                className="block font-semibold">
                {t('app:select_formality')}
                <select
                  id="formality"
                  {...register('formality')}
                  disabled={isGenerating}
                  onChange={(e) => {
                    return setValue('formality', e.target.value as Formality, { shouldValidate: true });
                  }}
                  className="w-full rounded border p-2">
                  {formalityOptions.map(({ label, value }) => {
                    return (
                      <option
                        key={value}
                        value={value}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className="mt-4 rounded bg-blue-500 p-2 capitalize text-white">
              {isGenerating ? t(t('app:generating_your_cover_letter_label')) : t('app:generate_cover_letter_label')}
            </button>
          </form>
        </Transition>
        <Transition
          className="absolute left-0 right-0"
          show={coverLetter.length !== 0}
          enter="ease-in-out duration-1000 transition-[opacity,transform]"
          enterFrom="-translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
          leave="ease-in-out duration-1000 transition-[opacity,transform]"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="-translate-x-full opacity-0">
          <div className="mt-4">
            <h2 className="mb-2 text-xl font-semibold">Generated Cover Letter</h2>
            <Editor
              value={coverLetter}
              onEditorChange={(changedValue) => {
                setCoverLetter(changedValue);
              }}
              init={{ placeholder: t('app:generated_cover_letter_label') }}
              id="cover-letter"
            />
          </div>
        </Transition>
      </div>
      <DonatePopup />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18next = await serverSideTranslations(locale as string, ['common', 'app']);

  return {
    props: {
      ...i18next,
    },
  };
};

export default AppPage;
