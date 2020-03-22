import React from 'react';
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import {Text, ThemedView, withTheme} from 'src/components';
import {margin} from 'src/components/config/spacing';

const ParentCategory = ({data, selectVisit, onChange, theme, width}) => {
  return (
    <ThemedView style={{width}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              {
                borderBottomColor: theme.colors.bgColorSecondary,
              },
              item.id === selectVisit && {
                backgroundColor: theme.colors.bgColorSecondary,
                borderLeftColor: theme.colors.primary
              }
            ]}
            onPress={() => onChange(item.id)}
          >
            <Text
              style={styles.name}
              medium={item.id === selectVisit}
            >{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  )
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderLeftWidth: 5,
    borderLeftColor: 'transparent'
  },
  name: {
    marginVertical: margin.large + 4,
    marginHorizontal: margin.small,
  }
});

ParentCategory.defaultProps = {
  data: [],
  onChange: () => {},
  width: 124,
};

export default withTheme(ParentCategory);
