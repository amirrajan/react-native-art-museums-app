import React, { memo } from "react";
import { FlatList, Dimensions } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

import {
  FeedItem,
  FeedItemGrid,
  CARD_OFFSET,
  GRID_COLUMNS
} from "../components/FeedItem";

const width = Dimensions.get("window").width;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 95
};

function areEqual(p, n) {
  if (
    p.grid !== n.grid ||
    p.records !== n.records ||
    p.ListFooterComponent !== n.ListFooterComponent
  ) {
    return false;
  }
  return true;
}

const renderItem = ({ item }) => <FeedItem {...item} />;
const renderItemGrid = ({ item }) => <FeedItemGrid {...item} />;
const getItemLayout = (data, index) => {
  const height = width / GRID_COLUMNS;
  return {
    length: height,
    offset: height * index,
    index
  };
};
const getItemLayoutGrid = (data, index) => {
  const height = width + CARD_OFFSET;
  return {
    length: height,
    offset: height * index,
    index
  };
};

const FlatListBase = memo(
  ({
    records,
    grid,
    setVisibleIndex,
    visibleIndex,
    listKey,
    navigation,
    ...other
  }) => {
    return grid ? (
      <FlatList
        key={"regular-list" + listKey}
        initialScrollIndex={Math.max(
          (visibleIndex - (visibleIndex % GRID_COLUMNS)) / GRID_COLUMNS,
          0
        )}
        data={records}
        numColumns={GRID_COLUMNS}
        renderItem={renderItemGrid}
        keyExtractor={item => item.id.toString()}
        onViewableItemsChanged={setVisibleIndex}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayoutGrid}
        {...other}
      />
    ) : (
      <FlatList
        key={"grid-list" + listKey}
        initialScrollIndex={Math.max(visibleIndex, 0)}
        data={records}
        numColumns={1}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onViewableItemsChanged={setVisibleIndex}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        {...other}
      />
    );
  },
  areEqual
);

FlatListBase.propTypes = {
  records: PropTypes.array.isRequired,
  grid: PropTypes.bool.isRequired,
  setVisibleIndex: PropTypes.func.isRequired,
  visibleIndex: PropTypes.number.isRequired,
  listKey: PropTypes.string.isRequired
};

export default withNavigation(FlatListBase);
