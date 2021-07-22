import React, { LegacyRef, useRef } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface DelayTextInputProps extends TextInputProps {
  delayTimeout: number,
  minLength: number,
  delayedCallback: (value: string) => void,
};

const DelayTextInput = React.forwardRef((props: DelayTextInputProps, ref: LegacyRef<TextInput>) => {
  const {
    onChangeText = () => {},
    minLength = 3,
    delayTimeout = 500,
    delayedCallback = () => {},
    ...rest
  } = props;

  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cachedValue = useRef<string>(props.defaultValue || '');

  useEffect(() => () => {
    resetTimer();
  }, []);

  const notify = useCallback((value: string) => {
    const valueToUpdate = (value.length >= minLength) ? value : '';
    delayedCallback(valueToUpdate);
  }, [minLength]);

  const resetTimer = useCallback(() => {
    if (timerId.current !== null) {
      clearTimeout(timerId.current);
    }
  }, []);

  const runTimeoutUpdate = useCallback((value) => {
    resetTimer();
    timerId.current = setTimeout(() => notify(value), delayTimeout);
  }, []);

  const onChangeTextHandler = useCallback((value: string) => {
    cachedValue.current = value;
    onChangeText(value);
    runTimeoutUpdate(value);
  }, [onChangeText]);

  return (
    <TextInput
      ref={ref}
      onChangeText={onChangeTextHandler}
      {...rest}
    />
  );
});

export default DelayTextInput;