import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center space-x-2">
                <span>⚠️</span>
                <span>Application Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Something went wrong while loading the application.
              </p>

              {this.state.error && (
                <div className="bg-gray-900 p-4 rounded-lg">
                  <h4 className="text-red-400 font-semibold mb-2">
                    Error Details:
                  </h4>
                  <p className="text-sm text-gray-300 font-mono">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                </div>
              )}

              {this.state.errorInfo && (
                <details className="bg-gray-900 p-4 rounded-lg">
                  <summary className="text-red-400 font-semibold cursor-pointer">
                    Stack Trace
                  </summary>
                  <pre className="text-xs text-gray-400 mt-2 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Reload Page
                </Button>
                <Button
                  onClick={() =>
                    this.setState({
                      hasError: false,
                      error: undefined,
                      errorInfo: undefined,
                    })
                  }
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => (window.location.href = "/admin")}
                  variant="outline"
                  className="border-purple-600 text-purple-400"
                >
                  Go to Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
