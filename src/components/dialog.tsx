import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, ReactNode, SetStateAction } from 'react';

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  className?: string;
};

export const DialogView = ({ isOpen, setOpen, children, className }: Props) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40"
        onClose={() => setOpen(false)} // Fechando o dialog
      >
        {/* Fundo do Dialog */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75" />
        </Transition.Child>

        {/* Conteúdo do Dialog */}
        <div className="fixed inset-0 z-40 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative w-full sm:w-[90vw] lg:w-[70vw] overflow-hidden rounded-lg bg-white p-4 text-left shadow-xl transition-all ${className}`}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
