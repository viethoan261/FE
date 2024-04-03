import React from 'react';
import { Button, ButtonProps } from '@mantine/core';

interface CustomeButtonProps extends ButtonProps {
  visible: boolean;
}

const CustomeButton: React.FC<CustomeButtonProps> = ({ visible, ...rest }) => {
  if (!visible) {
    return null;
  }

  return <Button {...rest} />;
};

export default CustomeButton;
