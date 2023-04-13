import React, { useState } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { Screen } from '../../components'
import { Button, Card, Layout, Modal, Text, List, ListItem } from '@ui-kitten/components';
const { width, height } = Dimensions.get('window');
export const ProductCategoryModal = ({ visible, productCategories, setProductCategories, onCloseModal }) => {
    const renderItem = ({ item, index }) => (
        <View>
            <View>
                <Text style={{ fontWeight: '700', lineHeight: 40 }}>{item.CategoryName}</Text>
            </View>
            {
                item.ProductCategoryChildList && <View style={{ marginLeft: 15 }}>
                    <List
                        // style={{ paddingVertical: 15 }}
                        data={item.ProductCategoryChildList}
                        renderItem={({ item: i, index: idx }) => renderItemChild({ item: i, index: idx, idxParent: index })}
                        keyExtractor={item => item.Id}
                        numColumns={3}
                    />
                </View>
            }
        </View>
    )
    const onClickItemChild = (index, idxParent) => {
        let newProductCategories = [...productCategories];
        newProductCategories[idxParent].ProductCategoryChildList[index].Checked = !newProductCategories[idxParent].ProductCategoryChildList[index].Checked;
        setProductCategories(newProductCategories);
    }
    const renderItemChild = ({ item, index, idxParent }) => (
        <TouchableOpacity onPress={() => onClickItemChild(index, idxParent)}>
            <View>
                {item.Checked ? <Text style={{ width: (width - 150) / 3, lineHeight: 30, marginRight: 10, borderRadius: 8, borderColor: '#AA0202', borderWidth: 1, textAlign: 'center', marginBottom: 10 }}>{item.CategoryName}</Text> : <Text style={{ width: (width - 150) / 3, lineHeight: 30, marginRight: 10, borderRadius: 8, borderColor: '#697077', borderWidth: 1, textAlign: 'center', marginBottom: 10 }}>{item.CategoryName}</Text>}
            </View>
        </TouchableOpacity>

    )
    return (
        <Modal visible={visible} style={styles.container}>
            <Card>
                <Text style={styles.title}>DANH MỤC SẢN PHẨM</Text>
                <View style={{ paddingHorizontal: 10, maxHeight: height - 40, marginVertical: 15 }}>
                    <List
                        style={{ maxHeight: height - 200 }}
                        data={productCategories}
                        renderItem={renderItem}
                        keyExtractor={item => item.Id}
                    />
                </View>
                <Button style={{ backgroundColor: '#A23232', width: 150,alignSelf : 'center' }} onPress={() => onCloseModal()}>
                    Hoàn thành
                    </Button>
            </Card>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width - 30
    },
    title: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24
    }
});