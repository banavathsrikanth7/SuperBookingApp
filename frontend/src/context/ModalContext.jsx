import { createContext, useState } from "react";

const ModalContext = createContext();

export default ModalContext;

export const ModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const contextData = {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return (
    <ModalContext.Provider value={contextData}>
      {children}
    </ModalContext.Provider>
  );
};
