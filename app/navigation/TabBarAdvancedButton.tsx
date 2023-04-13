import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faUser, faHome, faMapMarked, faSync } from "@fortawesome/free-solid-svg-icons"
import { Button } from '@ui-kitten/components';

type Props = BottomTabBarButtonProps & {
    bgColor?: string;
};

export const TabBarAdvancedButton: React.FC<Props> = ({
    bgColor,
    ...props
}) => (
    <View
        style={styles.container}
        pointerEvents="box-none"
    >
        {/* <Button style={{...styles.button,backgroundColor : bgColor}} status='danger' accessoryLeft={() => <FontAwesomeIcon
            color={'white'}
            style={styles.background}
            size={25}
            icon={faSync}
        />} /> */}

    </View>
);

const styles = StyleSheet.create({
    container: {
        // position: 'relative',
        width: 85,
        // top: 13,
        justifyContent: 'center',
        alignItems: 'center',
        // zIndex : 9999
    },
    background: {
        position: 'absolute',
        // top: 0,
        fontSize: 30,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
        padding: 5,
        borderRadius: 80,
        borderColor: 'white',
        borderWidth: 3
    },
    buttonIcon: {
        fontSize: 30,
        color: '#F6F7EB'
    }
});