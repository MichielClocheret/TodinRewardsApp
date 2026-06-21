import { Pressable, StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native'
import React from 'react'
import colors from '../css/colors'

import SearchIcon from '@/assets/media/Search.svg'
import FilterIcon from '@/assets/media/Filter.svg'

type SearchProps = {
  showFilter?: boolean;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
};

const Search = ({
  showFilter = true,
  borderRadius = 12,
  style,
  value,
  onChangeText,
  placeholder = "Search",
}: SearchProps) => {
  return (
    <View style={[styles.wrapper, style]}>
        <View style={[styles.searchContainer, { borderRadius }]}>
            <SearchIcon width={20} height={20} />
            <TextInput
              style={styles.searchInput}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.grey}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
        </View>
        {showFilter ? (
          <Pressable style={[styles.filter, { borderRadius }]}>
              <FilterIcon width={18} height={18}/>
          </Pressable>
        ) : null}
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        flexDirection:"row",
        alignItems:"center",
        gap:12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.stroke,
    },
    searchInput: {
        flex: 1,
        color: colors.grey,
        fontFamily: "DMSans-Regular",
        fontSize: 16,
        paddingVertical: 0,
    },
    filter:{
        backgroundColor: colors.white,
        borderWidth:1,
        borderColor:colors.stroke,
        padding:12,
        borderRadius:12,
        alignItems: "center",
        justifyContent: "center",
    }
})
