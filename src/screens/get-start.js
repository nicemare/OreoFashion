import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, StatusBar } from 'react-native';
import { Button, ThemedView } from 'src/components';
import Container from 'src/containers/Container';
import GetStartSwiper from 'src/containers/GetStartSwiper';

import { closeGettingStarted } from 'src/modules/common/actions';
import { routerMainSelector } from 'src/modules/common/selectors';
import { margin } from 'src/components/config/spacing';

class GetStartScreen extends React.Component {
  handleGettingStarted = () => {
    const { navigation, router, handleCloseGettingStarted } = this.props;
    handleCloseGettingStarted();
    navigation.navigate(router)
  };

  render() {
    const {
      screenProps: { t },
    } = this.props;
    return (
        <ThemedView isFullView>
          <StatusBar hidden />
          <GetStartSwiper />
          <Container style={styles.viewButton}>
            <Button
                title={t('home:text_getting_start')}
                onPress={this.handleGettingStarted}
            />
          </Container>
        </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  viewButton: {
    marginVertical: margin.big,
  },
});

const mapStateToProps = state => {
  return {
    router: routerMainSelector(state),
  };
};

const mapDispatchToProps = {
  handleCloseGettingStarted: closeGettingStarted,
};

export default connect(mapStateToProps, mapDispatchToProps)(GetStartScreen);
