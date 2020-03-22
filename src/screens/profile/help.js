import React from 'react';
import { Header, ListItem, ThemedView } from 'src/components';

import Container from 'src/containers/Container';
import { IconHeader, TextHeader, CartIcon } from 'src/containers/HeaderComponent';

import { profileStack } from 'src/config/navigator';

export default class HelpScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const {
      navigation,
      screenProps: { t },
    } = this.props;
    const titleProps = {
      medium: true,
    };

    return (
      <ThemedView style={{ flex: 1 }}>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_help_info')} />}
          rightComponent={<CartIcon />}
        />
        <Container>
          <ListItem
            title={t('profile:text_contact')}
            titleProps={titleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(profileStack.contact)}
          />
          <ListItem
            title={t('profile:text_privacy')}
            titleProps={titleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(profileStack.privacy)}
          />
          <ListItem
            title={t('profile:text_term')}
            titleProps={titleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(profileStack.privacy)}
          />
          <ListItem
            title={t('profile:text_about')}
            titleProps={titleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(profileStack.about)}
          />
          <ListItem
            title={t('profile:text_rate_app')}
            titleProps={titleProps}
            chevron
            type="underline"
            onPress={() => navigation.navigate(profileStack.about)}
          />
        </Container>
      </ThemedView>
    );
  }
}
