import { createContext, useState, useContext, ReactNode } from "react";

export enum NotificationStatus {
  "SUCCESS",
  "DANGER",
  "ERREUR",
}

type NotificationContextType = {
  showNotification: (message: string, status: NotificationStatus) => void;
  notificationMessage: string | null;
  notificationStatus: NotificationStatus;
  isNotificationVisible: boolean;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [notificationStatus, setNotificationStatus] =
    useState<NotificationStatus>(NotificationStatus.SUCCESS);
  const [isNotificationVisible, setIsNotificationVisible] =
    useState<boolean>(false);

  const showNotification = (message: string, status: NotificationStatus) => {
    setNotificationMessage(message);
    setNotificationStatus(status);
    setIsNotificationVisible(true);

    setTimeout(() => {
      setIsNotificationVisible(false);
    }, 2000); // Notification will disappear after 2 seconds
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        notificationStatus,
        notificationMessage,
        isNotificationVisible,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
