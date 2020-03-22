import React from 'react';
import {connect} from 'react-redux';
import concat from 'lodash/concat';
import {Map, fromJS} from 'immutable';

import {View, StyleSheet} from 'react-native';

import {Header, ThemedView} from 'src/components';
import Container from 'src/containers/Container';
import {TextHeader, IconHeader, CartIcon} from 'src/containers/HeaderComponent';
import Loading from 'src/containers/Loading/LoadingDefault';
import Empty from 'src/containers/Empty';

import Refine from './containers/Refine';
import SwitchProduct from './containers/SwitchProduct';
import ProductView from './containers/ProductView';
import CategoryList from './product/CategoryList';

import {sortBySelector, filterBySelector} from 'src/modules/product/selectors';
import {languageSelector} from 'src/modules/common/selectors';

import {clearFilter, fetchProducts as clearData} from 'src/modules/product/actions';
import {getProducts} from 'src/modules/product/service';

import {margin} from 'src/components/config/spacing';
import {mainStack, homeTabs} from 'src/config/navigator';
import {categorySelector} from 'src/modules/category/selectors';

class ProductsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
    const {
      navigation,
      screenProps: {t},
      categories,
    } = props;

    const category = navigation.getParam('id', '');
    let name = navigation.getParam('name', '');

    if (!name) {
      const findCategory = categories.find(c => c.id == category);
      name =
        findCategory && findCategory.name
          ? findCategory.name
          : t('common:text_category');
    }

    this.state = {
      category,
      name,
      loading: true,
      refreshing: false,
      loadingMore: false,
      data: [],
      page: 1,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  componentDidUpdate(prevProps) {
    const {navigation} = this.props;

    const sort = navigation.getParam('sortBy', Map());
    const filter = navigation.getParam('filterBy', Map());

    const prevSort = prevProps.navigation.getParam('sortBy', Map());
    const prevFilter = prevProps.navigation.getParam('filterBy', Map());

    if (!sort.equals(prevSort) || !filter.equals(prevFilter)) {
      this.fetchProducts(1);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearData([]));
    this.props.dispatch(clearFilter());
  }

  getData = page => {
    const {sortBy, filterBy, lang, navigation} = this.props;
    const {category} = this.state;

    const query = Map({
      status: 'publish',
      lang: lang,
      per_page: 4,
      page: page,
    })
      .merge(sortBy.get('query'))
      .merge(filterBy)
      .merge(navigation.getParam('filterBy', Map()))
      .set(
        'category',
        filterBy.get('category') ? filterBy.get('category') : category,
      );
    return getProducts(query.toJS());
  };

  fetchProducts = async (page = this.state.page) => {
    try {
      const dataGet = await this.getData(page);

      if (dataGet.length <= 4 && dataGet.length > 0) {
        this.setState(preState => {
          return {
            loading: false,
            refreshing: false,
            loadingMore: dataGet.length === 4,
            data: page === 1 ? dataGet : concat(preState.data, dataGet),
          };
        });
      } else {
        this.setState({
          loadingMore: false,
          loading: false,
          refreshing: false,
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  };

  handleCategoryPress = (id, name) => {
    this.props.navigation.push(mainStack.products, {
      id: id,
      name: name,
    });
  };

  handleLoadMore = () => {
    const {loadingMore} = this.state;

    if (loadingMore) {
      this.setState(
        prevState => ({
          page: prevState.page + 1,
          loadingMore: true,
        }),
        () => {
          this.fetchProducts();
        },
      );
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      () => {
        this.fetchProducts();
      },
    );
  };

  render() {
    const {
      categories,
      navigation,
      screenProps: {t},
    } = this.props;
    const {category, name, data, loading, loadingMore, refreshing} = this.state;

    const subsCategory = categories.filter(cat => cat.parent === category);

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={name} />}
          rightComponent={<CartIcon />}
        />
        {loading ? (
          <Loading />
        ) : data.length ? (
          <View style={styles.viewList}>
            <Container style={styles.viewRefineSwitch}>
              <Refine onPress={() => navigation.navigate(mainStack.refine, {parent: category, data})}/>
              <SwitchProduct />
            </Container>
            <CategoryList
              onPress={this.handleCategoryPress}
              data={subsCategory}
            />
            <ProductView
              data={fromJS(data)}
              loadingMore={loadingMore}
              refreshing={refreshing}
              handleLoadMore={this.handleLoadMore}
              handleRefresh={this.handleRefresh}
            />
          </View>
        ) : (
          <Empty
            icon="box"
            title={t('empty:text_title_product')}
            subTitle={t('empty:text_subtitle_product')}
            titleButton={t('common:text_go_shopping')}
            clickButton={() => navigation.navigate(homeTabs.shop)}
          />
        )}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  viewRefineSwitch: {
    marginTop: margin.base,
    marginBottom: margin.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewList: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  const {data} = categorySelector(state);
  return {
    sortBy: sortBySelector(state),
    filterBy: filterBySelector(state),
    lang: languageSelector(state),
    categories: data,
  };
};

export default connect(mapStateToProps)(ProductsScreen);
