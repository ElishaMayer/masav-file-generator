import { Button, Result } from "antd";
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    window.firebase.analytics().logEvent("exception", {
      fatal: true,
      description: error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={
            <Button onClick={() => window.location.reload()} type="primary">
              Reload
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}
