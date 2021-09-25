import KeyboardEventHandler from 'react-keyboard-event-handler';

export default function keybaord(props) {
  return (
    <KeyboardEventHandler
      handleKeys={props.keys}
      onKeyEvent={(key, e) =>
        props.callBack(key)
      }
    />
  );
}
