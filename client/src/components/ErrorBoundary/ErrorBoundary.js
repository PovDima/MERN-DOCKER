import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      info: null,
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.error('getDerivedStateFromError', error)

    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo)
    console.error('componentDidCatch', error, errorInfo)

    this.setState({
      hasError: true,
      error,
      info: errorInfo,
    })
  }

  render() {
    const { children } = this.props
    const { error, info, hasError } = this.state

    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-container">
          <h1>Oops, something went wrong :(</h1>
          <p>
            <strong>The error: </strong>
            {error && error.toString()}
          </p>
          <pre>
            <p>
              Where it occured:
              {info && info.componentStack}
            </p>
          </pre>
          {/* <Button onClick={() => window.location.reload()}>Click Here</Button> */}
        </div>
      )
    }

    return children || null
  }
}
export default ErrorBoundary
