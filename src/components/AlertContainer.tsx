import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AlertProps, alertService } from "../services/alert.service";
import { Alert } from "./Alert";

interface Props {
  id: string;
}

export function AlertContainer({ id }: Props) {
  const [alerts, setAlerts] = useState<Array<AlertProps>>([]);
  const history = useHistory();

  useEffect(() => {
    // Subscribe to alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // Clear all alerts if we get an empty one
      if (!alert.message) {
        setAlerts([]);
        return;
      }

      // Add alert to array
      setAlerts((alerts) => [...alerts, alert]);

      if (alert.autoclose) {
        setTimeout(() => removeAlert(alert), 5000);
      }
    });

    // Clear alerts on location change
    const historyUnlisten = history.listen(() => {
      alertService.clear(id);
    });

    // Clean up our subscriptions and listeners when the component
    // is destroyed
    return () => {
      subscription.unsubscribe();
      historyUnlisten();
    };
  });

  function removeAlert(alert: AlertProps) {
    const alertWithFade = { ...alert, fade: true };
    setAlerts((alerts) =>
      alerts.map((obj) => (obj === alert ? alertWithFade : obj))
    );

    setTimeout(() => {
      setAlerts((alerts) => alerts.filter((obj) => obj !== alertWithFade));
    }, 150);
  }

  return (
    <div className="container lg:max-w-3xl mx-auto py-2">
      {alerts.map((alert: AlertProps, index: number) => (
        <Alert
          key={index}
          type={alert.type}
          message={alert.message}
          fade={alert.fade}
          onClose={() => removeAlert(alert)}
        />
      ))}
    </div>
  );
}
