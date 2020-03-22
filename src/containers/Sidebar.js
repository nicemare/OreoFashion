import React from 'react';
import { connect } from 'react-redux';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedView, Text, ListItem } from 'src/components';
import ItemCategoryMenu from './ItemCategoryMenu';

import { categorySelector } from 'src/modules/category/selectors';

import { padding, margin } from 'src/components/config/spacing';

import { homeDrawer, profileStack } from 'src/config/navigator';

const dataHelpInfo = [
  {
    id: '1',
    name: 'common:text_home',
    router: homeDrawer.home_tab,
  },
  {
    id: '2',
    name: 'common:text_blogs',
    router: homeDrawer.blog,
  },
  {
    id: '3',
    name: 'common:text_about',
    router: profileStack.about,
  },
  {
    id: '4',
    name: 'common:text_contact',
    router: profileStack.contact,
  },
  {
    id: '5',
    name: 'common:text_privacy_full',
    router: profileStack.privacy,
  },
];

class Sidebar extends React.Component {
  getListCategory = (parent = 0) => {
    const { category } = this.props;
    return category.data.filter(item => item.parent === parent);
  };

  handlePage = (router, params = {}) => {
    const { navigation } = this.props;
    if (!navigation) {
      return null;
    }
    navigation.navigate(router, params);
  };

  render() {
    const {
      navigation,
      screenProps: { t },
    } = this.props;
    const dataCategory = this.getListCategory();
    return (
      <ThemedView isFullView>
        <ScrollView>
          <Text h3 medium style={[styles.title, styles.titleHead]}>
            {t('common:text_category')}
          </Text>
          {dataCategory.map(c => (
            <ItemCategoryMenu
              key={c.id}
              category={c}
              subCategories={this.getListCategory(c.id)}
              isOpen={navigation.state && navigation.state.isDrawerOpen ? navigation.state.isDrawerOpen : false}
              goProducts={this.handlePage}
            />
          ))}
          <Text h3 medium style={styles.title}>
            {t('common:text_help')}
          </Text>
          {dataHelpInfo.map(value => (
            <ListItem
              key={value.id}
              title={t(value.name)}
              titleProps={{
                medium: true,
              }}
              type="underline"
              small
              containerStyle={styles.item}
              onPress={() => this.handlePage(value.router)}
            />
          ))}
        </ScrollView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginTop: margin.big + 4,
    marginBottom: margin.small + 1,
    paddingHorizontal: padding.large,
  },
  titleHead: {
    paddingTop: getStatusBarHeight()
  },
  item: {
    paddingHorizontal: padding.large,
  },
});

const mapStateToProps = state => ({
  category: categorySelector(state),
});
export default connect(mapStateToProps)(Sidebar);
