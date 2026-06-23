import React, { useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import colors from "@/app/css/colors";

type Props<T> = {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  initialCount?: number;
  ItemSeparatorComponent?: () => React.JSX.Element;
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
  style?: StyleProp<ViewStyle>;
};

function ShowMoreList<T>({
  data,
  renderItem,
  keyExtractor,
  initialCount = 3,
  ItemSeparatorComponent,
  ListHeaderComponent,
  ListEmptyComponent,
  style,
}: Props<T>) {
  const [showAll, setShowAll] = useState(false);
  const visibleData = showAll ? data : data.slice(0, initialCount);
  const hasMore = data.length > initialCount;

  return (
    <View style={style}>
      <FlatList
        data={visibleData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
      {hasMore && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowAll((v) => !v)}
        >
          <Text style={styles.showMoreText}>
            {showAll ? "Less" : `More (${data.length - initialCount})`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ShowMoreList;

const styles = StyleSheet.create({
  showMoreButton: {
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
    marginTop: 4,
  },
  showMoreText: {
    fontFamily: "DMSans-Medium",
    fontSize: 14,
    color: colors.todinBlue,
  },
});
