import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { IContact } from '../../interfaces/contact.interface';
import { ContactsService } from '../../services/contacts.service';
import { contactsMapStyles } from './styles/map.styles';
import MapView, { Marker } from 'react-native-maps';
import DefaultMarker from '../contact/styles/contact.styles';

export const MapScreen: React.FC = () => {
    const [contacts, setContacts] = useState<IContact[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            const storedContacts = await ContactsService.getContacts();
            setContacts(storedContacts);
        };
        fetchContacts();
    }, []);

    return (
        <View style={contactsMapStyles.mapContainer}>
            <MapView
                style={contactsMapStyles.mapView}
                initialRegion={{
                    latitude: 6.2442,
                    longitude: -75.5812,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation
                showsMyLocationButton
                loadingEnabled
                zoomControlEnabled
            >
                {contacts.map((contact) => (
                    <Marker
                        key={contact.id}
                        title={contact.name}
                        description={`Celular: ${contact.number}`}
                        coordinate={contact.location}
                        opacity={1}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={[contactsMapStyles.markerContainer, { borderColor: contact.role === 'Cliente' ? 'red' : 'blue' }]}>
                            {contact.image ? (
                                <Image
                                    source={{ uri: contact.image }}
                                    style={contactsMapStyles.markerImage}
                                />
                            ) : (
                                <DefaultMarker name={contact.name} />
                            )}
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
};
