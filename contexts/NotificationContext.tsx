import { createContext, useState, useContext, ReactNode } from "react";

type NotificationContextType = {
  showNotification: (message: string) => void;
  notificationMessage: string | null;
  isNotificationVisible: boolean;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState<boolean>(false);

  const showNotification = (message: string) => {
    setNotificationMessage(message);
    setIsNotificationVisible(true);

    setTimeout(() => {
      setIsNotificationVisible(false);
    }, 2000); // Notification will disappear after 2 seconds
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, notificationMessage, isNotificationVisible }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
