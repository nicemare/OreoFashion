import React from 'react';

import {fromJS, Map} from 'immutable';
import {connect} from 'react-redux';

import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Header, ThemedView, Text} from 'src/components';
import ShippingForm from '../cart/containers/ShippingForm';
import Container from 'src/containers/Container';
import Button from 'src/containers/Button';
import {TextHeader, CartIcon, IconHeader} from 'src/containers/HeaderComponent';

import {
  authSelector,
  shippingAddressSelector,
} from 'src/modules/auth/selectors';
import {updateShippingAddress} from 'src/modules/auth/actions';

import {margin} from 'src/components/config/spacing';

class AddressBookScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shipping: props.shippingAddress,
    };
  }

  handleSave = () => {
    const {dispatch} = this.props;
    const {shipping} = this.state;
    dispatch(updateShippingAddress(shipping));
  };

  onChange = (key, value) => {
    const {shipping} = this.state;
    this.setState({
      shipping: shipping.set(key, value),
    });
  };

  render() {
    const {shipping} = this.state;
    const {
      screenProps: {t, theme},
      auth: {pendingUpdateShippingAddress, updateShippingAddressError},
    } = this.props;
    const {message, errors} = updateShippingAddressError;

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_address')} />}
          rightComponent={<CartIcon />}
        />
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboard}
          enabled={Platform.OS === 'ios'}>
          <ScrollView>
            <Container>
              {message ? (
                <Text style={{color: theme.colors.error}}>{message}</Text>
              ) : null}
              <ShippingForm
                data={shipping}
                onChange={this.onChange}
                errors={Map(errors) || Map()}
              />
              <Button
                title={t('profile:text_button_address')}
                containerStyle={styles.button}
                onPress={this.handleSave}
                loading={pendingUpdateShippingAddress}
              />
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
  button: {
    marginVertical: margin.big,
  },
});

const mapStateToProps = state => ({
  shippingAddress: shippingAddressSelector(state),
  auth: authSelector(state),
});

export default connect(mapStateToProps)(AddressBookScreen);
