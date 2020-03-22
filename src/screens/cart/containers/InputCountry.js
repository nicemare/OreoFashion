import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';

import moment from 'moment';
import {connect} from 'react-redux';

import InputSelectValue from 'src/containers/input/InputSelectValue';
import {SearchBar, Modal, ListItem} from 'src/components';

import {countrySelector} from 'src/modules/common/selectors';
import {fetchCountries} from 'src/modules/common/actions';

import {fromCharCode} from 'src/utils/string';
import {padding} from 'src/components/config/spacing';

class InputCountry extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      search: '',
    };
  }

  componentDidMount() {
    const {country, dispatch} = this.props;
    if (
      !country.get('expire') ||
      moment.unix(country.get('expire')).isBefore(moment())
    ) {
      dispatch(fetchCountries());
    }
  }

  setModalVisible = visible => {
    this.setState({
      visible,
    });
  };

  handleCountrySelect = item => {
    const {onChange} = this.props;
    onChange('country', item.code);
    this.setModalVisible(false);
  };

  updateSearch = search => {
    this.setState({search});
  };

  render() {
    const {visible, search} = this.state;
    const {label, value, country, error} = this.props;

    const countries = country.get('data').toJS();
    const loading = country.get('loading');

    const selected = countries.find(country => country.code === value);

    const dataCountry = countries.filter(
      country => country.name.toLowerCase().indexOf(search.toLowerCase()) >= 0,
    );
    return (
      <>
        <InputSelectValue
          onPress={() => this.setModalVisible(true)}
          label={label}
          value={selected ? fromCharCode(selected.name) : ''}
          error={error}
        />

        {/*Modal country*/}
        <Modal
          visible={visible}
          setModalVisible={this.setModalVisible}
          ratioHeight={0.7}
          underTopElement={
            <View style={{paddingHorizontal: 10}}>
              <SearchBar
                cancelButton={false}
                placeholder="Type Here..."
                onChangeText={this.updateSearch}
                value={search}
                platform="ios"
                onClear={() => this.setState({search: ''})}
                containerStyle={{
                  paddingVertical: 0,
                  paddingBottom: padding.small,
                }}
              />
            </View>
          }>
          <View
            style={{
              paddingHorizontal: padding.big,
              paddingBottom: padding.base,
            }}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={dataCountry}
                keyExtractor={item => item.code}
                renderItem={({item, index}) => (
                  <ListItem
                    onPress={() => this.handleCountrySelect(item)}
                    title={fromCharCode(item.name)}
                    type="underline"
                    activeOpacity={1}
                    rightIcon={
                      value === item.code
                        ? {
                            name: 'check',
                            size: 22,
                          }
                        : null
                    }
                    containerStyle={styles.item}
                  />
                )}
              />
            )}
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 0,
    paddingVertical: padding.large - 2,
  },
});

const mapStateToProps = state => ({
  country: countrySelector(state),
});

export default connect(mapStateToProps)(InputCountry);
