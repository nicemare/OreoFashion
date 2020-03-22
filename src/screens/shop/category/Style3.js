import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, FlatList, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import Container from 'src/containers/Container';
import OpacityView from 'src/containers/OpacityView';
import Notification from './Notification';
import EmptyCategory from './EmptyCategory';

import {categorySelector} from 'src/modules/category/selectors';
import {borderRadius, margin, padding} from 'src/components/config/spacing';
import {black, white} from 'src/components/config/colors';
import ButtonGroup from '../../../containers/ButtonGroup';

const {width} = Dimensions.get('window');

const noImage = require('src/assets/images/imgCateDefault.png');

class Style3 extends React.Component {
  constructor(props) {
    super(props);
    const {category: {data}} = props;
    const listParent = data.filter(value => value.parent === 0);

    const parent = listParent && listParent[0] ? listParent[0].id: null;
    this.state = {
      listParent,
      parent
    }
  }

  changeParent = index => {
    const {listParent} = this.state;
    const findCategory = listParent.find((c, inx) => inx === index);
    if (findCategory && findCategory.id) {
      this.setState({
        parent: findCategory.id,
      });
    }
  };

  render() {
    const {category: {data}, t, goProducts} = this.props;
    const {listParent, parent} = this.state;

    if (listParent.length < 1) {
      return (
        <EmptyCategory />
      )
    }
    const size = (width - 2 * padding.large - padding.small)/2;
    const listData = data.filter(value => value.parent === parent || value.id === parent);
    const sortData = listData.sort((a, b) => a.parent !== parent && b.parent === parent);

    return (
      <>
        <Container disable="right">
          <ButtonGroup
            lists={listParent}
            visit={listParent.findIndex(c => c.id === parent)}
            pad={40}
            containerStyle={styles.listParentCategory}
            contentContainerStyle={styles.contentListParentCategory}
            clickButton={index => this.changeParent(index)}
          />
        </Container>
        <Notification containerStyle={styles.notification}/>
        {listData.length < 1 ? (
          <EmptyCategory/>
        ) : (
          <Container style={styles.content}>
            <FlatList
              numColumns={2}
              columnWrapperStyle={styles.viewCol}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => `${item.id}`}
              data={sortData}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.item} onPress={() => goProducts(item)}>
                  <Image
                    source={
                      item && item.image && item.image.src
                        ? {uri: item.image.src}
                        : noImage
                    }
                    style={{width: size, height: size}}
                  />
                  <OpacityView style={styles.viewText}>
                    <Text style={styles.text} h4 medium>
                      {item.id === parent ? t('catalog:text_view_all') : item.name}
                    </Text>
                  </OpacityView>
                </TouchableOpacity>
              )}
            />
          </Container>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  listParentCategory: {
    marginBottom: margin.big - 4,
  },
  contentListParentCategory: {
    paddingRight: margin.large,
  },
  notification: {
    marginBottom: margin.base,
  },
  content: {
    flex: 1,
  },
  viewCol: {
    justifyContent: 'space-between',
    marginBottom: margin.small,
  },
  item: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
  },
  viewImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: black,
    opacity: 0.4,
  },
  viewText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  text: {
    paddingHorizontal: padding.base,
    paddingVertical: padding.base + 2,
    textAlign: 'center',
    color: white,
  },
});

Style3.defaultProps = {
  goProducts: () => {}
};

const mapStateToProps = state => {
  return {
    category: categorySelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(Style3));
