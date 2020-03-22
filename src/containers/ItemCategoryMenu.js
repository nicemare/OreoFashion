import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Icon } from 'src/components';
import { padding } from 'src/components/config/spacing';

import { mainStack } from 'src/config/navigator';

class ItemCategoryMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSub: false,
    };
  }
  componentDidUpdate(preProps) {
    if (preProps.isOpen && !this.props.isOpen) {
      this.setState({
        isShowSub: false,
      });
    }
  }
  handleGoProducts = category => {
    const params = {
      id: category.id,
      name: category.name,
    };
    this.props.goProducts(mainStack.products, params);
  };

  render() {
    const { category, subCategories } = this.props;
    const { isShowSub } = this.state;
    if (!category) {
      return null;
    }
    return (
      <>
        <ListItem
          title={category.name}
          titleProps={{
            medium: true,
          }}
          titleStyle={styles.textItem}
          rightElement={
            subCategories.length > 0 && (
              <Icon
                name={isShowSub ? 'minus' : 'plus'}
                size={14}
                iconStyle={styles.icon}
                activeOpacity={1}
                underlayColor={'transparent'}
                onPress={() => this.setState({ isShowSub: !isShowSub })}
              />
            )
          }
          type="underline"
          small
          onPress={() => this.handleGoProducts(category)}
        />
        {subCategories.length > 0 && isShowSub && (
          <View style={styles.viewSubs}>
            {subCategories.map(subC => (
              <ListItem
                key={subC.id}
                title={subC.name}
                titleProps={{
                  medium: true,
                }}
                type="underline"
                small
                containerStyle={styles.itemSub}
                onPress={() => this.handleGoProducts(subC)}
              />
            ))}
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  textItem: {
    paddingHorizontal: padding.large,
  },
  icon: {
    padding: padding.large,
  },
  viewSubs: {
    paddingLeft: padding.large,
  },
  itemSub: {
    paddingHorizontal: padding.large,
  },
});

ItemCategoryMenu.defaultProps = {
  subCategories: [],
  isOpen: false,
  goProducts: () => {},
};

export default ItemCategoryMenu;
