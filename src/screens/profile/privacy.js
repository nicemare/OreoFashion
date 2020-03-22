import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Header, Text, ThemedView } from 'src/components';

import { IconHeader, CartIcon, TextHeader } from 'src/containers/HeaderComponent';
import Container from 'src/containers/Container';
import ContainerPrivacy from './containers/ContainerPrivacy';

import { margin } from 'src/components/config/spacing';
import { lineHeights } from 'src/components/config/fonts';

export default class SettingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    const {
      screenProps: { t },
    } = this.props;
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_privacy')} />}
          rightComponent={<CartIcon />}
        />
        <ContainerPrivacy />
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: margin.big,
  },
  titleList: {
    marginBottom: margin.base + 4,
  },
  description: {
    marginBottom: 50,
    lineHeight: lineHeights.h4,
  },
});
