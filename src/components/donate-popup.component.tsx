import { Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const DonatePopup = () => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <Transition
      appear
      show
      className="fixed bottom-0 flex items-center gap-10 border-t border-black bg-slate-50 px-6 py-4"
      enter="transition-transform ease-in-out duration-1000 delay-1000"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transition-transform ease-in-out duration-1000"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{t('common:support_our_services_label')}</h2>
        <p className="text-justify">{t('common:your_support_is_absolutely_vital_to_us')}</p>
      </div>
      <a
        href={`https://nowpayments.io/donation?api_key=${process.env.NEXT_PUBLIC_NOW_PAYMENTS_API_KEY}&source=lk_donation&medium=referral`}
        target="_blank"
        rel="noreferrer nofollow"
        className="w-full">
        <Image
          width={229}
          height={70}
          src="https://nowpayments.io/images/embeds/donation-button-black.svg"
          alt="Crypto donation button by NOWPayments"
          className="w-auto"
        />
      </a>
    </Transition>,
    document.body,
  );
};
