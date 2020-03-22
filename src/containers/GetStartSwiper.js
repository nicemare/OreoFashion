import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import {Text} from 'src/components';
import Container from './Container';
import Pagination from './Pagination';

import {languageSelector} from 'src/modules/common/selectors';

import {margin} from 'src/components/config/spacing';

const {width} = Dimensions.get('window');
const WIDTH_IMAGE = width;
const HEIGHT_IMAGE = (WIDTH_IMAGE * 390) / 375;

const data = [
  {
    image: require('src/assets/images/getting-start/get-start-1.png'),
    title: {
      en: 'Shopping Smart',
      ar: 'التسوق الذكي',
    },
    subtitle: {
      en: 'Welcome to OREO Store',
      ar: 'مرحبًا بكم في متجر OREO',
    },
  },
  {
    image: require('src/assets/images/getting-start/get-start-2.png'),
    title: {
      en: 'Focus UX',
      ar: 'التركيز UX',
    },
    subtitle: {
      en: 'Personalization of User Experience',
      ar: 'إضفاء الطابع الشخصي على تجربة المستخدم',
    },
  },
  {
    image: require('src/assets/images/getting-start/get-start-3.png'),
    title: {
      en: 'Creative Concept',
      ar: 'مفهوم الإبداعي',
    },
    subtitle: {
      en: 'Discovering new horizons',
      ar: 'اكتشاف آفاق جديدة',
    },
  },
];

class GetStartSwiper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {scrollX: new Animated.Value(0), height: 0};
  }

  render() {
    const {t} = this.props;
    const {scrollX} = this.state;
    const position = Animated.divide(scrollX, width);

    const data = [
      {
        image: require('src/assets/images/getting-start/get-start-1.png'),
        title: t('getting:text_title_1'),
        subtitle: t('getting:text_subtitle_1'),
      },
      {
        image: require('src/assets/images/getting-start/get-start-2.png'),
        title: t('getting:text_title_2'),
        subtitle: t('getting:text_subtitle_2'),
      },
      {
        image: require('src/assets/images/getting-start/get-start-3.png'),
        title: t('getting:text_title_3'),
        subtitle: t('getting:text_subtitle_3'),
      },
    ];
    return (
      <ScrollView style={styles.container}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {x: scrollX},
              },
            },
          ])}
          scrollEventThrottle={16}
        >
          {data.map((swiper, index) => (
            <View key={index} style={styles.viewItem}>
              <Image
                source={swiper.image}
                resizeMode="stretch"
                style={styles.image}
              />
              <Container style={styles.viewInfo}>
                <Text h1 medium style={[styles.text, styles.title]}>
                  {swiper.title}
                </Text>
                <Text colorSecondary style={styles.text}>
                  {swiper.subtitle}
                </Text>
              </Container>
            </View>
          ))}
        </ScrollView>
        <Pagination
          type="animated"
          activeVisit={position}
          count={data.length}
          containerStyle={styles.viewPagination}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: WIDTH_IMAGE,
    height: HEIGHT_IMAGE,
  },
  viewInfo: {
    marginVertical: margin.big + margin.small,
  },
  text: {
    textAlign: 'center',
  },
  title: {
    marginBottom: margin.small,
  },
  viewPagination: {
    marginTop: margin.small,
    marginBottom: margin.big,
    justifyContent: 'center',
  },
});

export default withTranslation()(GetStartSwiper);
