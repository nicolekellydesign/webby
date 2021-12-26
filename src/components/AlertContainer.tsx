import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Alert, AlertDescription, AlertIcon, CloseButton, Stack } from "@chakra-ui/react";

import { AlertProps, alertService } from "@Services/alert.service";

interface IAlertContainerProps extends Object {
  id: string;
}

export const AlertContainer: React.FC<IAlertContainerProps> = ({ id }) => {
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
    setAlerts((alerts) => alerts.map((obj) => (obj === alert ? alertWithFade : obj)));

    setTimeout(() => {
      setAlerts((alerts) => alerts.filter((obj) => obj !== alertWithFade));
    }, 150);
  }

  return (
    <Stack spacing="1rem" marginX="auto" paddingY="1rem" width={{ base: "full", lg: "48rem" }}>
      {alerts.map((alert: AlertProps, idx) => (
        <Alert key={idx} status={alert.type} borderRadius="0.5rem" minHeight="4rem">
          <AlertIcon />
          <AlertDescription>{alert.message}</AlertDescription>
          <CloseButton position="absolute" right="1rem" top="1rem" onClick={() => removeAlert(alert)} />
        </Alert>
      ))}
    </Stack>
  );
};
