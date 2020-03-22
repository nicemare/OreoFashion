import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, withTheme } from 'src/components';

import currencyFormatter from 'src/utils/currency-formatter';

import { grey4 } from 'src/components/config/colors';
import { margin, padding } from 'src/components/config/spacing';

const ProductItemOrder = ({ item, style, theme, currency }) => {
  const isTax = parseFloat(item.total_tax) !== 0;
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
        },
        style && style,
      ]}
    >
      <Text colorSecondary style={styles.textName}>
        {item.name}
      </Text>
      {item.meta_data.length > 0 && (
        <View style={styles.viewAttribute}>
          {item.meta_data.map(meta => (
            <Text key={meta.id} style={styles.textAttribute}>
              {`${meta.key}: ${meta.value}`}
            </Text>
          ))}
        </View>
      )}
      <Text medium>
        {currencyFormatter(item.price, currency)} <Text colorSecondary>x {item.quantity}</Text>
      </Text>
      {isTax && (
        <Text colorSecondary style={styles.textTax}>
          Tax: <Text medium>{currencyFormatter(item.total_tax, currency)}</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: padding.large,
    marginBottom: margin.large,
    borderBottomWidth: 1,
  },
  textName: {
    marginBottom: margin.small,
  },
  viewAttribute: {
    marginBottom: margin.small,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textAttribute: {
    color: grey4,
    fontSize: 10,
    lineHeight: 15,
    marginRight: margin.small,
  },
  textTax: {
    marginTop: margin.small,
  },
});

export default withTheme(ProductItemOrder);
