import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAppSelector } from '@/app/hooks/reduxHooks'
import colors from '@/app/css/colors'
import globalStyles from '@/app/css/styles'
import { ProfileStackNavProps } from '@/app/navigators/types'
import GoBack from '@/app/components/GoBack'
import Button from '@/app/components/Button'
import ShopCard from '@/app/components/ShopCard'

const FavouriteShops = ({ navigation }: ProfileStackNavProps<'favouriteshops'>) => {
  const favorites = useAppSelector((state) => state.favorites)

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.screen]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <GoBack />
        <Text style={styles.title}>Favourite Shops</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <ShopCard item={item} />}
        ListEmptyComponent={
            <View style={{paddingTop:20}}>
                <Button title='Checkout Shops' onPress={() => navigation.getParent()?.navigate('home')} />
                <Text style={[styles.emptyText]}>You haven't added any favourite shops yet.</Text>
            </View>
        }
      />
    </SafeAreaView>
  )
}

export default FavouriteShops

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 4,
  },
  title: {
    fontFamily: 'DMSans-Medium',
    fontSize: 24,
    fontWeight: '600',
    color: colors.black,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 12,
  },
  row: {
    gap: 12,
  },
  emptyText: {
    paddingTop: 10,
    textAlign: 'center',
    color: colors.grey,
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
  },
})
