import {
  NotificationStatus,
  useNotification,
} from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";

const MyNotification = () => {
  const { notificationMessage, notificationStatus, isNotificationVisible } =
    useNotification();
  const [isSlidingIn, setIsSlidingIn] = useState<boolean>(false);

  useEffect(() => {
    if (isNotificationVisible) {
      setIsSlidingIn(true);
    } else {
      setIsSlidingIn(false);
    }
  }, [isNotificationVisible]);

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white  ${
        notificationStatus === NotificationStatus.SUCCESS
          ? " bg-green-600"
          : notificationStatus === NotificationStatus.DANGER
          ? "bg-orange-600"
          : "bg-red-600"
      }
          transition-transform duration-300 ease-in-out ${
            isSlidingIn
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
    >
      {notificationMessage}
    </div>
  );
};
export default MyNotification;
