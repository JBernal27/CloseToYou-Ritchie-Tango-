import { StyleSheet } from 'react-native';

export const contactsMapStyles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        width: '100%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    mapView: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        width: 35,
        height: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
    },
    markerImage: {
        width: 25,
        height: 25,
        borderRadius: 20,
    },
    markerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444',
        textAlign: 'center',
        marginTop: 5,
    },
});
