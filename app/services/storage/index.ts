import { AsyncStorage } from 'react-native';
export const StorageKey = {
    JWT_TOKEN: 'JWT_TOKEN',
    USER_INFO: 'USER_INFO',
    PHONE: 'PHONE',
    USERID: 'USERID',
    PASSWORD: 'USER_PASSWORDINFO',
    HOUSE_MODEL_ID: 'HOUSE_MODEL_ID',
    HISTORY_ID: 'HISTORY_ID',
    ISFROMHOUSE: "ISFROMHOUSE",
    ISNEWNOTIFICATION: "ISNEWNOTIFICATION",
    NUMBERNOTI: 'NUMBERNOTI'
}
export class Storage {
    async clearStore() {
        // await Promise.all(Object.keys(StoreKey).map(key => {
        //     removeItem(key);
        // }))
        AsyncStorage.clear();
    }

    async getToken() {
        var access_token = await String(AsyncStorage.getItem(StorageKey.JWT_TOKEN));
        return 'Bearer ' + access_token;
    }

    async getItem(key: string) {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                return JSON.parse(value);
            }
        } catch (error) {
            return null;
            // Error retrieving data
        }

    }
    async removeItem(key: string) {
        await AsyncStorage.removeItem(key)
    }
    async logout() {
        await AsyncStorage.removeItem(StorageKey.JWT_TOKEN);
        await AsyncStorage.removeItem(StorageKey.PHONE);
        await AsyncStorage.removeItem(StorageKey.PASSWORD);
        await AsyncStorage.removeItem(StorageKey.USER_INFO)
    }
    async setItem(key: string, val: any) {
        try {
            await AsyncStorage.removeItem(key)
            await AsyncStorage.setItem(key, JSON.stringify(val))
        } catch (error) {

        }

    }
    async setItemNumber({ key, val }: { key: string; val: any; }) {
        try {
            await AsyncStorage.removeItem(key)
            await AsyncStorage.setItem(key, JSON.stringify(val))
        } catch (error) {

        }
    }
}
