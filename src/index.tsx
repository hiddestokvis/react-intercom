import * as React from 'react';
const canUseDOM: boolean = !(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
);

export const IntercomAPI = (...args: any[]) => {
  if (canUseDOM && window.hasOwnProperty('Intercom')) {
    window['Intercom'].apply(null, args);
  } else {
    console.warn('Intercom not initialized yet');
  }
};

interface IntercomProps {
  appID: string;
}

interface iProps {
  q: any[];
  c: (args: any) => any;
}

export class Intercom extends React.Component<IntercomProps, {}> {

  static displayName: string = 'Intercom';

  constructor(props: IntercomProps) {
    super(props);

    const {
      appID,
      ...otherProps,
    } = props;

    if (!appID || !canUseDOM) {
      return;
    }

    if (!window['Intercom']) {
      (function(w: any, d: any, id: string, s?: any, x?: any) {
        function i(): iProps {
          const i: iProps = {
            q: [],
            c: (args) => i.q.push(args),
          };
          return i;
        }
        w['Intercom'] = i;
        s = d.createElement('script');
        s.async = 1;
        s.src = 'https://widget.intercom.io/widget/' + id;
        x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      })(window, document, appID);
    }

    window['intercomSettings'] = { ...otherProps, app_id: appID };

    if (window['Intercom']) {
      window['Intercom']('boot', otherProps);
    }
  }

  componentWillReceiveProps(nextProps: IntercomProps) {
    const {
      appID,
      ...otherProps,
    } = nextProps;

    if (!canUseDOM) return;

    window['intercomSettings'] = { ...otherProps, app_id: appID };
    window['Intercom']('update', otherProps);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (canUseDOM) {
      window['Intercom']('shutdown');
      delete window['Intercom'];
    }
  }

  render() {
    return null;
  }
}
