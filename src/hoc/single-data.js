import { lifecycle, withState, compose } from 'recompose';
import { getSingleProduct, getSingleBlog } from 'src/modules/product/service';

export const getSingleData = lifecycle({
  componentDidMount() {
    const { navigation, lang } = this.props;
    const id = navigation.getParam('id', "");
    const type = navigation.getParam('type', "product");
    const { updateData, updateLoading } = this.props;
    if (id) {
      const fetchData = type === 'blog' ? getSingleBlog : getSingleProduct;
      fetchData(id, lang).then(data => {
        updateData(data);
      }).catch(error => {
        console.log(error, id);
      }).finally(() => {
        updateLoading(false);
      })
    } else {
      updateLoading(false);
    }
  },
});


export const defaultPropsData = compose(
  withState('loading', 'updateLoading', true),
  withState('data', 'updateData', {}),
);
