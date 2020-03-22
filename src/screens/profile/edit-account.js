import React from 'react';
import {StyleSheet, KeyboardAvoidingView, ScrollView} from 'react-native';
import {ThemedView, Text, Header} from 'src/components';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import Button from 'src/containers/Button';
import {margin} from 'src/components/config/spacing';

class EditAccount extends React.Component {
  render() {
    const {
      screenProps: {t},
    } = this.props;
    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('profile:text_edit_account')} />}
        />
        <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
          <ScrollView>
            <Container>
              <Input label={t('inputs:text_first_name')} />
              <Input label={t('inputs:text_last_name')} />
              <Input label={t('inputs:text_display_name')} />
              <Text h6 colorThird style={styles.description}>
                {t('profile:text_description_edit_account')}
              </Text>
              <Input label={t('inputs:text_email_address')} />
              <Button title={t('common:text_save')} containerStyle={styles.button}/>
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  description: {
    marginVertical: 4,
  },
  button: {
    marginVertical: margin.big,
  },
});

export default EditAccount;
