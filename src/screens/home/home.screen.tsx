import React from 'react';
import { SectionList, TextInput, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContactCard from './components/contact-card.component';
import { RootStackParamList } from '../../router/navigations';
import { useHomeLogic } from './hooks/use-home-logic.hook';
import { homeStyles } from './styles/home.styles';

const { height } = Dimensions.get('window');


export default function Home() {
    const navigate = useNavigation<NavigationProp<RootStackParamList>>();
    const { sections, searchText, handleSearch } = useHomeLogic();

    return (
        <SafeAreaView>
            <View style={homeStyles.container}>
                <TextInput
                    style={homeStyles.input}
                    placeholder="Buscar"
                    placeholderTextColor="gray"
                    value={searchText}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity onPress={() => navigate.navigate('AddContact')} style={homeStyles.button}>
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
                        location={item.location}
                    />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={homeStyles.sectionHeader}>{title}</Text>
                )}
                stickySectionHeadersEnabled={true}
                ListEmptyComponent={
                    <Text style={homeStyles.emptyMessage}>No se encontraron contactos</Text>
                }
            />
        </SafeAreaView>
    );
}
