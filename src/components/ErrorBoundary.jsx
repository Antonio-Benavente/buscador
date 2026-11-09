import { Component } from 'react';
import { useLocation } from 'react-router-dom';
import { logError } from '../utils/log';

class ErrorBoundaryBase extends Component {
    state = { error: null, pathname: this.props.pathname };

    static getDerivedStateFromProps(props, state) {
        if (props.pathname === state.pathname) return null;

        return state.error ? { pathname: props.pathname, error: null } : { pathname: props.pathname };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error) {

        logError(error, 'errorBoundary');
    }

    render() {
        return this.state.error ? this.props.fallback : this.props.children;
    }
}

export default function ErrorBoundary({ children, fallback }) {
    const { pathname } = useLocation();

    return (
        <ErrorBoundaryBase pathname={pathname} fallback={fallback}>
            {children}
        </ErrorBoundaryBase>
    );
}
