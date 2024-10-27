import {StyleSheet} from 'react-native';

export const homeStyles = StyleSheet.create({
    input: {
        height: 35,
        margin: 10,
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 7,
        flex: 1,
        color: 'black',
    },
    button: {
        height: 40,
        width: 40,
        margin: 10,
        backgroundColor: 'skyblue',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        marginVertical: 10,
    },
    sectionHeader: {
        backgroundColor: '#fff',
        padding: 5,
        paddingHorizontal: 20,
        fontWeight: 'bold',
        fontSize: 26,
        color: 'black',
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: 'gray',
    },
});
