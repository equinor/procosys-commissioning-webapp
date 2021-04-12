import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

// TODO: research type vs. interface (?)
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initializeAppInsights = (instrumentationKey: string) => {
    const browserHistory = createBrowserHistory({ basename: '' });
    const reactPlugin = new ReactPlugin();
    const appInsights = new ApplicationInsights({
        config: {
            instrumentationKey: instrumentationKey,
            extensions: [reactPlugin],
            extensionConfig: {
                [reactPlugin.identifier]: { history: browserHistory },
            },
        },
    });
    appInsights.loadAppInsights();
    return {
        appInsightsReactPlugin: reactPlugin,
        appInsightsInstance: appInsights,
    };
};

export default initializeAppInsights;
