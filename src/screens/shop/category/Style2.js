import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, FlatList, Text, Image, TouchableOpacity} from 'react-native';
import Container from 'src/containers/Container';
import ButtonGroup from 'src/containers/ButtonGroup';
import Notification from './Notification';
import EmptyCategory from './EmptyCategory';
import {categorySelector} from 'src/modules/category/selectors';
import {borderRadius, margin} from 'src/components/config/spacing';
import {black} from 'src/components/config/colors';

const noImage = require('src/assets/images/imgCateDefault.png');

class Style2 extends React.Component {
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
        <Notification containerStyle={styles.notification} />
        {listData.length < 1 ? (
          <EmptyCategory />
          ) : (
          <Container style={styles.content}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => `${item.id}`}
              data={sortData}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.item} onPress={() => goProducts(item)}>
                  <Text h4 medium style={styles.text}>
                    {item.id === parent ? t('catalog:text_view_all') : item.name}
                  </Text>
                  <Image
                    source={
                      item && item.image && item.image.src ? {uri: item.image.src} : noImage
                    }
                    style={styles.image}
                  />
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
  item: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    marginBottom: margin.base,
  },
  text: {
    color: black,
    flex: 1,
    marginHorizontal: margin.large,
  },
  image: {
    width: 94,
    height: 94,
  },
});

Style2.defaultProps = {
  goProducts: () => {}
};

const mapStateToProps = state => {
  return {
    category: categorySelector(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(Style2));
