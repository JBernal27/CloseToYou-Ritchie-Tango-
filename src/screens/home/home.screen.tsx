import React from 'react';
import { SectionList, StyleSheet, TextInput, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContactCard from './components/contact-card.component';
import { RootStackParamList } from '../../router/navigations';
import { useHomeLogic } from './hooks/use-home-logic.hook';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
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

export default function Home() {
    const navigate = useNavigation<NavigationProp<RootStackParamList>>();
    const { sections, searchText, handleSearch } = useHomeLogic();

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Buscar"
                    placeholderTextColor="gray"
                    value={searchText}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity onPress={() => navigate.navigate('AddContact')} style={styles.button}>
                    <Icon name="person-add-alt-1" color="#fff" size={25} />
                </TouchableOpacity>
            </View>
            <SectionList
                style={{height: height - 90}}
                sections={sections}
                keyExtractor={(item, index) => item.id.toString() + index}
                renderItem={({ item }) => (
                    <ContactCard
                        id={item.id}
                        name={item.name}
                        number={item.number}
                        email={item.email}
                        image={item.image}
                        role={item.role}
                        isFavorite={item.isFavorite}
                    />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                stickySectionHeadersEnabled={true}
                ListEmptyComponent={
                    <Text style={styles.emptyMessage}>No se encontraron contactos</Text>
                }
            />
        </SafeAreaView>
    );
}
