import React from 'react';
import { Text, withTheme } from 'src/components';
import Container from 'src/containers/Container';
import { padding, margin } from 'src/components/config/spacing';

const ContainerView = ({ style, title, subTitle, children, theme, ...rest }) => {
  const styleContainer = {
    paddingVertical: padding.big,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  };
  return (
    <Container {...rest} style={[styleContainer, style && style]}>
      {title && (
        <Text
          medium
          h4
          style={{
            marginBottom: margin.small,
          }}
        >
          {title}
        </Text>
      )}
      {subTitle && (
        <Text
          medium
          style={{
            marginBottom: margin.small,
          }}
        >
          {subTitle}
        </Text>
      )}
      {children && children}
    </Container>
  );
};

export default withTheme(ContainerView);
