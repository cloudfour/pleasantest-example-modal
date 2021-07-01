import * as React from 'react';
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import '@reach/dialog/styles.css';
import './App.css';

export function App(props) {
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <div>
      <button onClick={open}>Open Dialog</button>

      <Dialog isOpen={showDialog} onDismiss={close}>
        <button className="close-button" onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        <p>
          Hello there. I am a dialog. <a href="/something">Here</a> is some{' '}
          <a href="/something-else">Focusable Content</a>
        </p>
      </Dialog>
    </div>
  );
}
