import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'src/components';

const TextHeader = ({ title, subtitle, titleStyle, subtitleStyle, containerStyle, type, onPress }) => {
  if (type === 'button') {
    return (
      <TouchableOpacity style={[styles.button, containerStyle && containerStyle]} onPress={onPress}>
        <Text h6 colorThird style={titleStyle && titleStyle}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.container, containerStyle && containerStyle]}>
      <Text style={titleStyle && titleStyle} h4 medium>
        {title}
      </Text>
      {subtitle && (
        <Text h6 colorThird style={subtitleStyle && subtitleStyle}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    padding: 6
  }
});

TextHeader.propTypes = {};

TextHeader.defaultProps = {
  type: 'default',
  title: '',
  onPress: () => {},
};

export default TextHeader;
